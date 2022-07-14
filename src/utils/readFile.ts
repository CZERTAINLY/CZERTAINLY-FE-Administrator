import { Observable } from "rxjs";

export function readFileString$(file: FileList): Observable<string> {

   // Could use Observable.create (same thing) but I
   // prefer this one because Observable.create is
   // not part of the TC39 proposal

   return new Observable(

      observer => {

         const reader = new FileReader();

         reader.onload = () => {
            observer.next(reader.result as string);
            observer.complete();
         };

         reader.onerror = e => {
            observer.error(e);
         }

         reader.readAsText(file[0]);

         return () => {
            if (reader.readyState === 1) reader.abort();
         };

      }

   );

}