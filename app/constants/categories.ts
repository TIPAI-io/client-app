import React from "react";

const CATEGORIES = [
  {
    id: 'order-food',
    icon: require('../../assets/images/order_food.png'),
    title: 'Order food',
    desc: 'Get food delivered to your home with Doordash, Uber Eats, etc.',
    actionScore: '+120',
    tipPoints: '+10k',
  },
  {
    id: 'ask-for-rides',
    icon: require('../../assets/images/ask_for_rides.png'),
    title: 'Ask for rides',
    desc: 'Schedule rides from Uber, Lyft or Tesla RoboTaxi, etc.',
    actionScore: '+150',
    tipPoints: '+20k',
  },
  {
    id: 'shopping',
    icon: require('../../assets/images/shopping.png'),
    title: 'Shopping',
    desc: 'Shop from home goods, fashion, electronics from 100+ online stores.',
    actionScore: '+150',
    tipPoints: '+20k',
  },
  {
    id: 'calendar-summary',
    icon: require('../../assets/images/calendar_summary.png'),
    title: 'Calendar Summary',
    desc: 'Generate a summary of meetings and events you have in the next few days.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
  {
    id: 'email-summary',
    icon: require('../../assets/images/email_summary.png'),
    title: 'Email Summary',
    desc: 'Generate a summary of emails you received in last week.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
  {
    id: 'friends-story',
    icon: require('../../assets/images/friends_story.png'),
    title: 'Friends Story',
    desc: 'Generate a summary of posts or stories of friends.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
];

export default CATEGORIES; 