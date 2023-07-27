import {IStackGitConfig} from './IStackGitConfig';
import {IStackAutoUpdate} from './IStackAutoUpdate';

export interface IStackInfo {
	Id: number;
	EntryPoint?: string;
	AdditionalFiles?: string[];
	AutoUpdate?: IStackAutoUpdate;
	GitConfig?: IStackGitConfig;
}
