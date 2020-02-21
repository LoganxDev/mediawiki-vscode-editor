// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { multiStepInput } from './multiStepInput';
import { loginHelper } from './loginHelper';
const bent =  require('bent');

let window = vscode.window;

async function setMediaWikiUrl(context: vscode.ExtensionContext) {
	// Open a textbox for the user to input the URL
	const url = await window.showInputBox({
		placeHolder: 'For example: http://mediawiki.org'
	});

	if (url) {
		// Display a message box to the user
		vscode.window.showInformationMessage('media wiki url is now: ' + String(url));
		context.globalState.update('mediaWikiUrl', url);
	} else {
		vscode.window.showErrorMessage("No url entered");
	}
};

async function loginMediaWiki(context: vscode.ExtensionContext) {
	const requestUrl: String = context.globalState.get('mediaWikiUrl') || '';

	console.log(requestUrl);

	let result = await loginHelper(context, requestUrl);

	// God this api takes a lot to login :skull:

	console.log(result);
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "media-wiki-editor" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.setMediaWikiUrl', async () => {
		// The code you place here will be executed every time your command is executed
		await setMediaWikiUrl(context);

		// console.log(context.globalState.get('mediaWikiUrl'));
	});

	let login = vscode.commands.registerCommand('extension.loginMediaWiki', async () => {
		// The code you place here will be executed every time your command is executed
		await loginMediaWiki(context);

		// console.log(context.globalState.get('mediaWikiUsername'));
		// console.log(context.globalState.get('mediaWikiPassword'));
	});

	let searchMediaWiki = vscode.commands.registerCommand('extension.searchMediaWiki', () => {
		// The code you place here will be executed every time your command is executed
		loginMediaWiki(context);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(login);
	context.subscriptions.push(searchMediaWiki);
}

// this method is called when your extension is deactivated
export function deactivate() {}
