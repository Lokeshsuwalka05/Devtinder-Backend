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

- POST/request/send/:status/:userId
- POST/request/review/:status/:requestID

## userRouter

- GET/user/requests/received
- GET/user/connections
- GET/feed=>gets you the profiles of the other users on the platform.

Status:ingnore,interested,accepted,rejected
