import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImagePreview } from 'src/app/types/image.type';

@Component({
  selector: 'image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.less'],
})
export class ImagePickerComponent {
  @Input() filePreviews: ImagePreview[] = [];
  @Output() filePreviewsChange = new EventEmitter<any>();
  constructor() {}

  uploadFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const image = new Image();
        image.onload = () => {
          let height = image.height,
            width = image.width;
          const maxSize = 1400;
          if (image.width > image.height && image.width > maxSize) {
            width = maxSize;
            height = (image.height * maxSize) / image.width;
          }
          if (image.height > image.width && image.height > maxSize) {
            height = maxSize;
            width = (image.width * maxSize) / image.height;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          fetch(dataUrl)
            .then((res) => {
              return res.blob();
            })
            .then((blob) => {
              console.log('blob');
              console.log(blob);
              console.log('file');
              console.log(file);
              const filePreview = {
                file: new File([blob], file.name, { type: blob.type }),
                preview: dataUrl,
              };
              this.filePreviews.push(filePreview);
            });
        };
        image.src = e.target.result;
      };
      this.filePreviewsChange.emit(this.filePreviews);
    }
  }

  cancel(filePreview: ImagePreview) {
    this.filePreviews = this.filePreviews.filter(
      (f: any) => f.file.name != filePreview.file.name
    );
  }
}
