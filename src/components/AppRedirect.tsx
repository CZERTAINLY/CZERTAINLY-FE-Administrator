import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { actions, selectors } from 'ducks/app-redirect';

export default function AppRedirect() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const unauthorized = useSelector(selectors.unauthorized);
   const goBack = useSelector(selectors.goBack);
   const redirectUrl = useSelector(selectors.redirectUrl);



   useEffect(

      () => {

         if (!goBack) return;
         dispatch(actions.clearGoBack());
         navigate(-1);

      },
      [dispatch, goBack, navigate]

   );


   useEffect(

      () => {

         if (!unauthorized) return;
         dispatch(actions.clearUnauthorized());
         navigate("/login");
      },
      [dispatch, navigate, unauthorized]

   );


   useEffect(

      () => {

         if (!redirectUrl) return;
         dispatch(actions.clearRedirectUrl());
         navigate(redirectUrl);

      },
      [dispatch, navigate, redirectUrl]

   );

   return null;

}