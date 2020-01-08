export const data = {};

export default class Bull {
  constructor(key) {
    this.key = key;
    data[key] = data[key] || [];
  }

  add(job) {
    data[this.key].push(job);
  }

  on() {
    return this;
  }

  process(handle) {
    data[this.key].forEach(async job => {
      await handle({ data: job });
    });
  }
}
