import {Tour} from './lib/tour/tour.model';

export const TOUR_CONFIG: Tour = {
  id: 'demo',
  isSequential: false,
  steps: [
    {
      id: 'home.get_started_1',
      actions: [],
      enabled: true,
      message: 'This is the first step of the demo tour',
      title: 'First Step Title'
    }
  ]
};
