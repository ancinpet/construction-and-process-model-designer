import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileIoService {
  public readonly untitledModelFilename = "untitled_model";
  public readonly contractFileExtension = ".contract";
  constructor() {
  }

  downloadFile(data: string, modelName: string) {
    let filename: string;
    if (!modelName || modelName.length == 0) {
      filename = this.untitledModelFilename;
    } else {
      filename = modelName.replace(/\s/g, "_");
    }
    filename = filename + this.contractFileExtension;
    let domElement = document.createElement('a');
    domElement.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
    domElement.setAttribute('download', filename);
    domElement.click();
    domElement.remove();
  }

  uploadFile(file: File): Observable<string> {
    return Observable.create((observer) => {
      const reader = new FileReader();

      reader.onerror = error => observer.error(error);
      reader.onabort = abortError => observer.error(abortError);
      reader.onload = () => observer.next(reader.result as string); //casting to string acceptable because readAsText() is used (see FileReader documentation) 
      reader.onloadend = () => observer.complete();

      return reader.readAsText(file);
    });

  }


}
