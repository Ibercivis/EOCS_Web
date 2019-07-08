import { FormControl } from "@angular/forms";
import * as moment from "moment";

export function DateValidator(format = "YYYY-MM-DD"): any {
  return (control: FormControl): { [key: string]: any } => {
    let d = control.value; //JSON format
    if(!d) return;
    let date = d.year + '-' + (!d.month ? d.month : zeroFill(d.month, 2)) + '-' + (!d.day ? d.day : zeroFill(d.day, 2));
    const val = moment(date, format, true);
    if (!val.isValid()) {
      return { invalidDate: true };
    }

    return null;
  };
}

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + "";
}