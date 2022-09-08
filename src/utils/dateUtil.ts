export function dateFormatter(date: any): string {

   function leading0(s: string, count: number) {

      while(s.length < count) {
         s = "0" + s;
      }

      return s;

   }


   try {

      const dateObj = new Date(date);

      const year = dateObj.getFullYear().toString();
      const month = leading0((dateObj.getMonth() + 1).toString(), 2);
      const day = leading0(dateObj.getDate().toString(), 2);
      const hours = leading0(dateObj.getHours().toString(), 2);
      const minutes = leading0(dateObj.getMinutes().toString(), 2);

      return `${year}-${month}-${day} ${hours}:${minutes}`;

      /*
      return new Intl.DateTimeFormat("en-GB", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
         hour: "numeric",
         minute: "numeric",
         second: "numeric",
      }).format(new Date(date));
      */

   } catch (error) {

      console.debug("Unable to convert the given date to date object");
      return date;

   }

}
