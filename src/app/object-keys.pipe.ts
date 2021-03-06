import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeys'
})
export class ObjectKeysPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return Object.keys(value).sort().map(key => ({ key, value: value[key] }))
  }
}
