import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./certificates";
import { actions as alertActions } from "./alerts";
import { transformCertDTOToCertModel } from "./transform/certificates";


const listCertificates: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCertificates.match
      ),
      switchMap(

         action => {

            return deps.apiClients.certificates.getCertificatesList(
               action.payload.itemsPerPage,
               action.payload.pageNumber,
               action.payload.filters
            ).pipe(

            map(list => slice.actions.listCertificatesSuccess(list.certificates.map(cert => transformCertDTOToCertModel(cert)))),

            catchError(err => of(slice.actions.listCertificatesFailure(extractError(err, "Failed to get certificates list"))))

         )
         }

      )

   )

}


const listCertificatesFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCertificatesFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const getCertificateDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCertificateDetail.match
      ),
      switchMap(

         action => deps.apiClients.certificates.getCertificateDetail(action.payload).pipe(

            map(certificate => slice.actions.getCertificateDetailSuccess(transformCertDTOToCertModel(certificate))),

            catchError(err => of(slice.actions.getCertificateDetailFailure(extractError(err, "Failed to get certificate detail"))))

         )

      )

   )

}


const getCertificateDetailFailure: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCertificateDetailFailure.match
      ),
      map(
         action => alertActions.error(action.payload || "Unexpected error occured")
      )

   )

}


const epics = [
   listCertificates,
   listCertificatesFailure,
   getCertificateDetail,
   getCertificateDetailFailure
];


export default epics;
