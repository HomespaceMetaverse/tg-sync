import express from 'express';
const router = express.Router();

import passport from 'passport';

import testUEcallBack from './test-ue-callback';

const backendUrl = `/discord`;

router.get(backendUrl, (req, res, next) => {
  // Extract custom parameter from the incoming request
  // making validation
  const state = (req.query.state || '') as string;

  // Use Passport to authenticate with Discord, passing the customParam as state
  passport.authenticate('discord', {
    scope: ['identify', 'email', 'guilds'],
    prompt: 'consent',
    state: encodeURIComponent(state), // Include the custom parameter
  })(req, res, next);
});

router.get(
  `${backendUrl}/callback`,
  passport.authenticate('discord', {
    scope: ['identify', 'email', 'guilds'],
    prompt: 'consent',
  })
);
if (process.env.NODE_ENV === 'development') {
  router.post(`${backendUrl}/test-ue-callback`, testUEcallBack);
}

export default router;
