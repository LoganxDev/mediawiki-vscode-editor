import { ExtensionContext, Uri } from 'vscode';

import { multiStepInput } from './multiStepInput';
const bent =  require('bent');

export async function loginHelper(context: ExtensionContext, mediaWikiUrl: string) {

	interface State {
        title: string;
        url: string;
		step: number;
		totalSteps: number;
		password: string;
		username: string;
    }

    // get a login token
    // fetch fields from authmanager
    // present required fields
    // post to module with loginreturnurl and required fields
    // return status

    async function getLoginToken(context: ExtensionContext) {
        // console.log('token request url is: ' + requestUrl);

        // Get a authentication token from the media wiki
        const getToken = bent(state.url, 'GET', 'json');
        let tokenResponse = await getToken("?action=query&meta=tokens&type=login&format=json");
        console.log(tokenResponse);
        const token = tokenResponse.query.tokens['logintoken'];

        return token;
    }

    async function getLoginFields(context: ExtensionContext) {
        const getFields = bent(state.url, 'GET', 'json');
        let fieldsResponse = await getFields("?action=query&meta=tokens&type=login&format=json");
        console.log(fieldsResponse);
        // const token = fieldsResponse.query.tokens['logintoken'];

        // return token;
    }

    async function askForFieldInputs(context: ExtensionContext) {
        // Open a multistep input for user to input credentials
        let state = await multiStepInput(context);

        context.globalState.update('mediaWikiUsername', state.username);
        context.globalState.update('mediaWikiPassword', state.password);

        // TODO: sanitize the username and password
        // if (username) {
        // 	// Display a message box to the user
        // 	vscode.window.showInformationMessage('media wiki url is now: ' + String(url));
        // } else {
        // 	vscode.window.showErrorMessage("No url entered");
        // }
    }

    async function requestLogin(loginToken: string) {
        // After getting the meta token, use it to login with the credentials
        const loginRequest = "?action=login&lgname=" + state.username + "&lgpassword=" + state.password + "&lgtoken=" + loginToken + "&format=json";
        // const jetheadLoginRequest = "title=Special:UserLogin&action=submitlogin&type=login&returnto=Main+Page";

        console.log(loginRequest);

        const login = bent(state.url, 'POST', 'json');
        let loginResponse = await login(loginRequest);

        console.log("finished login request");

        // // Successfully logged in :)
        console.log(loginResponse);
    }

    const state = {} as Partial<State>;
    state.url = mediaWikiUrl;
    const loginToken = await getLoginToken(context);
    const fields = await getLoginFields(context);
}