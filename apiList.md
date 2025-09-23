# Devtinder APIs

## authRouter

- Post /auth/signup
- Post /auth/login
- Post /auth/logout

## profileRouter

- GET/profile/view
- Patch/profile/edit
- PATCH/prfile/password

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
