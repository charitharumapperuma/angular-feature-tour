import {Tour} from './lib/tour/tour.model';

export const TOUR_CONFIG: Tour = {
  id: 'demo',
  isSequence: false,
  steps: [
    {
      id: 'header.title',
      enabled: true,
      title: 'First Step Title',
      message: 'Page title',
      on_complete: [
        'tour#home.get_started_1',
        'home.get_started_event_custom_key'
      ]
    },
    {
      id: 'home.get_started_1',
      enabled: true,
      message: 'This is the first step of the demo tour',
    }
  ]
};
