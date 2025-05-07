import { Route } from '@vaadin/router';
import './not-found/not-found.js';
import './history/history';
import './tasks/tasks';
import './jobs/jobs';

export const routes: Route[] = [
  { path: 'jobs', component: 'app-jobs', name: 'Jobs' },
  { path: 'tasks', component: 'app-tasks', name: 'Tasks' },
  { path: 'history', component: 'app-history', name: 'History' },
  { path: '', component: 'app-history', name: 'History' },
  // The fallback route should always be after other alternatives.
  { path: '(.*)', component: 'app-not-found' }
];
