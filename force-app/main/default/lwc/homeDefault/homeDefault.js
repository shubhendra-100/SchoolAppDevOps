import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class HomeDefault extends NavigationMixin(LightningElement) {

    connectedCallback() {
        console.log("Home Page Loaded");
    }
}