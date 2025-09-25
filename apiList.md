# Devtinder APIs

## authRouter

- Post /signup
- Post /login
- Post /logout

## profileRouter

- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password //Update password api

## connectionRequestRouter

- POST/request/send/interested/:userId
- POST/request/send/ignored/:userId
- POST/request/review/accepted/:requestID
- POST/request/review/rejected/:requestID

## userRouter

- GET /user/connections
- GET/user/requests
- GET/feed=>gets you the profiles of the other users on the platform.

Status:ingnore,interested,accepted,rejected
