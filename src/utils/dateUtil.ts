export function dateFormatter(date: any) {

   try {

      return new Intl.DateTimeFormat("en-GB", {
         year: "numeric",
         month: "long",
         day: "2-digit",
         hour: "numeric",
         minute: "numeric",
         second: "numeric",
      }).format(new Date(date));

   } catch (error) {

      console.debug("Unable to convert the given date to date object");
      return date;

   }

}
