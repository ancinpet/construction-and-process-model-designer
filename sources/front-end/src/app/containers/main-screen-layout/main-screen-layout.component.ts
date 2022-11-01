import { Component, OnInit, OnDestroy } from '@angular/core';
import { StateManagerService } from 'src/app/services/state-management/state-manager.service';
import { SaveModelAction, LoadModelAction, ChangeModelNameAction, RedoChangeAction, UndoChangeAction, ImportModelAction, NewModelAction } from 'src/app/services/state-management/actions';
import { OCDCommunicationService } from 'src/app/services/ocd-communication/ocd-communication.service';
import { Subscription, Subject, Observable, empty, throwError } from 'rxjs';
import { IPsiContract } from 'src/app/model/model';
import { debounceTime, map, retry, catchError } from 'rxjs/operators';
import { FileIoService } from 'src/app/services/file-io/file-io.service';
import { ImportExportService } from 'src/app/services/import-export/import-export.service';
import { MatSnackBar } from '@angular/material';
import { ErrorNotificationComponent } from 'src/app/components/error-notification/error-notification.component';

/**
 * This layout component represents the whole main screen of the application.
 * Build according to Mr. Skotnica´s specifications.
 */
@Component({
	selector: 'app-main-screen-layout',
	templateUrl: './main-screen-layout.component.html',
	styleUrls: ['./main-screen-layout.component.scss']
})
export class MainScreenLayoutComponent implements OnInit, OnDestroy {
	private stateManagementSubscribtion: Subscription;
	public modelName: string;
	private nameChanges$: Subject<string> = new Subject();
	private psiContract: IPsiContract;

	private readonly fileParseErrorMessage = "File import error: incompatible file format";
	private readonly fileReadErrorMessage = "File reading error: corrupted file";

	constructor(
		private stateManager: StateManagerService,
		private interactionManager: OCDCommunicationService,
		public fileIoManager: FileIoService,
		private importExportManager: ImportExportService,
		private notificationManager: MatSnackBar
	) { }

	ngOnInit() {
		this.stateManagementSubscribtion = this.stateManager.getPsiContract$()
			.subscribe(
				(psiContract => this.onModelStreamUpdate(psiContract)),
				(error => this.onModelStreamError(error)),
				(() => this.onModelStreamComplete())
			);

		this.nameChanges$.pipe(
			debounceTime(500),
		).subscribe(name => this.stateManager.dispatchAction(new ChangeModelNameAction(name)));
	}

	ngOnDestroy() {
		this.stateManagementSubscribtion.unsubscribe();
	}

	onSaveModel() {
		this.stateManager.dispatchAction(new SaveModelAction());
	}

	onLoadModel() {
		this.stateManager.dispatchAction(new LoadModelAction());
	}

	onUndoChange() {
		this.stateManager.dispatchAction(new UndoChangeAction());
	}

	onRedoChange() {
		this.stateManager.dispatchAction(new RedoChangeAction());
	}

	onModelNameChange() {
		this.nameChanges$.next(this.modelName);
	}

	private onModelStreamUpdate(psiContract: IPsiContract): void {
		this.modelName = psiContract.name;
		this.psiContract = psiContract;
	}

	private onModelStreamError(error) {
		console.log("subscribber error: %s", error);
	}

	private onModelStreamComplete() {
		console.log("subscribtion end");
	}


	private onImportModelSuccess(psiContract: IPsiContract): void {
		this.stateManager.dispatchAction(new ImportModelAction(psiContract));
	}

	private onFileParsingError(error) {
		console.log("[MODEL IMPORT - FILE PARSING ERROR]: %s", error);
		this.notificationManager.openFromComponent(ErrorNotificationComponent, {
			data: this.fileParseErrorMessage,
			duration: 4000
		});
	}

	private onFileReadingError(error) {
		console.log("[MODEL IMPORT - FILE READING ERROR]: %s", error);
		this.notificationManager.openFromComponent(ErrorNotificationComponent, {
			data: this.fileReadErrorMessage,
			duration: 4000
		});
	}

	public togglePropertyBar() {
		this.interactionManager.dispatchPropertyBarToggle();
	}

	onExportModel() {
		this.fileIoManager.downloadFile(this.importExportManager.exportModelAsJson(this.psiContract), this.modelName);
	}

	onImportModel(files: FileList) {
		let file: File = files.item(0);
		if (file) {
			let asyncReader: Observable<string> = this.fileIoManager.uploadFile(file);
			asyncReader.pipe(
				catchError((error) => { this.onFileReadingError(error); return throwError(error) }),
				catchError(empty),
				map(content => this.importExportManager.importModelFromJson(content))
			).subscribe(model => this.onImportModelSuccess(model), error => this.onFileParsingError(error));
		}
	}

	onNewModel() {
		this.stateManager.dispatchAction(new NewModelAction());
	}
}
