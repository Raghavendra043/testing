import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MessageThreadsService } from 'src/app/services/rest-api-services/message-threads.service';

@Component({
  selector: 'thread-image',
  templateUrl: './thread-image.component.html',
  styleUrls: ['./thread-image.component.less'],
})
export class ThreadImageComponent implements AfterViewInit {
  @Input() fullImageUrl!: string;
  @Input() thumbnailUrl!: string;
  @Input() showDelete = false;
  @Output() delete: EventEmitter<void> = new EventEmitter();

  fullSrc?: string;
  src?: string;
  open = false;
  deleteClicked = false;
  previewLoaded = false;
  loaded = false;

  constructor(private messageThreads: MessageThreadsService) {}

  ngAfterViewInit() {
    this.messageThreads.getAttachmentDataUrl(this.thumbnailUrl).subscribe({
      next: (dataUrl: string) => {
        this.src = dataUrl;
        this.previewLoaded = true;
      },
      error: (error: any) => {
        this.previewLoaded = true;
        console.error(error);
      },
    });
  }

  zoom() {
    this.open = true;
    this.deleteClicked = false;
    this.messageThreads.getAttachmentDataUrl(this.fullImageUrl).subscribe({
      next: (dataUrl: string) => {
        this.loaded = true;
        this.fullSrc = dataUrl;
      },
      error: console.error,
    });
  }

  closeModal() {
    this.open = false;
    this.deleteClicked = false;
  }

  openDeletionDialog(event: MouseEvent) {
    event.stopPropagation();
    this.deleteClicked = true;
  }

  confirmDelete(event: MouseEvent) {
    event.stopPropagation();
    this.messageThreads.deleteAttachment(this.fullImageUrl).subscribe({
      next: () => {
        this.open = false;
        this.delete.emit();
      },
      error: console.error,
    });
  }
}
