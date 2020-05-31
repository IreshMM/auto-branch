import { Application } from 'probot' // eslint-disable-line no-unused-vars
import { onPush } from './listeners';

export = (app: Application) => {
  app.on('push', onPush);
}
