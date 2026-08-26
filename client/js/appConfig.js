let configPromise;

export function loadAppConfig() {
  if (!configPromise) {
    configPromise = fetch('./config.json').then(response => response.json());
  }
  return configPromise;
}
