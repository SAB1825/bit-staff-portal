import useragent from 'useragent';

export const trackSession = (req, res, next) => {
  if (req.isAuthenticated()) {
    const agent = useragent.parse(req.headers['user-agent']);
    const deviceInfo = `${agent.os} - ${agent.toAgent()}`;

    const sessionIndex = req.user.sessions.findIndex(session => session.sessionId === req.sessionID);
    if (sessionIndex === -1) {
      req.user.sessions.push({
        sessionId: req.sessionID,
        deviceInfo,
        isActive: true,
        createdAt: new Date(),
      });
    } else {
      req.user.sessions[sessionIndex].isActive = true;
      req.user.sessions[sessionIndex].lastActive = new Date();
    }

    req.user.save();
  }
  next();
};