import {Tour} from './lib/tour/tour.model';

export const TOUR_CONFIG: Tour = {
  id: 'demo',
  isSequence: false,
  steps: [
    {
      id: 'header.title',
      title: 'First Step Title',
      message: 'Page title',
      on_complete: [
        'home.get_started_event_custom_key'
      ]
    },
    {
      id: 'home.get_started',
      message: 'This is the first step of the demo tour',
    },
    {
      id: 'header.get_started',
      message: 'This is the first step of the demo tour',
    },
    {
      id: 'home.title',
      message: 'This is the first step of the demo tour',
    }
  ]
};
