import {Tour} from './lib/tour/tour.model';

export const TOUR_CONFIG: Tour = {
  id: 'demo',
  isSequence: false,
  steps: [
    {
      id: 'header.title',
      actions: [],
      enabled: true,
      title: 'First Step Title',
      message: 'Page title'
    },
    {
      id: 'home.get_started_1',
      actions: [],
      enabled: true,
      message: 'This is the first step of the demo tour',
    }
  ]
};
