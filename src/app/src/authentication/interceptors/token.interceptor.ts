import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  const tokenizeRequest = req.clone({
    setHeaders: {
      authorization: `Bearer ${token}`,
    },
  });
  return next(tokenizeRequest);
};
