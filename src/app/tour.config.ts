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
      persist: true,
      message: 'Get started button',
    },
    {
      id: 'header.get_started',
      disabled: false,
      message: 'Get started button',
    },
    {
      id: 'home.title',
      message: 'First title of the page',
    }
  ]
};
