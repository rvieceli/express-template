import Bull from 'bull';

import redisConfig from '../config/redis';

import AccountConfirmationMail from '../app/jobs/AccountConfirmationMail';

const jobs = [AccountConfirmationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bull: new Bull(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bull.add(job);
  }

  processQueue() {
    jobs.forEach(job => {
      const { bull, handle } = this.queues[job.key];

      bull.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    // TODO: save failed jobs to rerun
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
