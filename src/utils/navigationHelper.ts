import {CommonActions, NavigationContainerRef} from '@react-navigation/native';

let navigator: NavigationContainerRef<any> | null = null;

export function setNavigator(navRef: NavigationContainerRef<any>) {
    navigator = navRef;
}

export function navigateToLogin() {
    if (!navigator) return;
    navigator.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        })
    );
}
