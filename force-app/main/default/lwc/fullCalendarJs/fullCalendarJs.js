import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import { NavigationMixin } from 'lightning/navigation';
import fetchAllEvents from '@salesforce/apex/FullCalendarService.fetchAllEvents';

export default class FullCalendarJs extends NavigationMixin(LightningElement) {

  fullCalendarJsInitialised = false;
  @track allEvents = [];
  @track selectedEvent = undefined;
  @track showDetail = false;
  @track title = "String Values";
  @track start  = "String Values";
  @track end = "String Values";
  @track description = "String Values";
  renderedCallback() {

    // Performs this operation only on first render
    if (this.fullCalendarJsInitialised) {
      return;
    }
    this.fullCalendarJsInitialised = true;

    // Executes all loadScript and loadStyle promises
    // and only resolves them once all promises are done
    Promise.all([
      loadScript(this, FullCalendarJS + '/FullCalendarJS/jquery.min.js'),
      loadScript(this, FullCalendarJS + '/FullCalendarJS/moment.min.js'),
      loadScript(this, FullCalendarJS + '/FullCalendarJS/theme.js'),
      loadScript(this, FullCalendarJS + '/FullCalendarJS/fullcalendar.min.js'),
      loadStyle(this, FullCalendarJS + '/FullCalendarJS/fullcalendar.min.css'),
      // loadStyle(this, FullCalendarJS + '/fullcalendar.print.min.css')
    ])
      .then(() => {
        // Initialise the calendar configuration
        this.getAllEvents();
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error({
          message: 'Error occured on FullCalendarJS',
          error
        });
      })
  }


  initialiseFullCalendarJs() {
    const ele = this.template.querySelector('div.fullcalendarjs');
    // eslint-disable-next-line no-undef
    $(ele).fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay,listWeek'
      },
      themeSystem: 'standard',
      defaultDate: new Date(),
      navLinks: true,
      editable: true,
      eventLimit: true,
      events: this.allEvents,
      dragScroll: true,
      droppable: true,
      weekNumbers: true,
      eventDrop: function (event, delta, revertFunc) {
        alert(event.title + " was dropped on " + event.start.format());
        if (!confirm("Are you sure about this change? ")) {
          revertFunc();
        }
      },
      eventClick: function (event, jsEvent, view) {
      // alert('Event Clicked ' + event.title)
       this.start=event.start._i;
      this.end=event.end._i;
      this.title=event.title;
      this.description=event.description;
         this.showDetail=true;
        this.selectedEvent = event;
        console.log(this.start);
        console.log(this.end)
        console.log(this.description);
        console.log(this.title);
        console.log(this.showDetail);
    
      },
      dayClick: function (date, jsEvent, view) {
        jsEvent.preventDefault();

      },
      eventMouseover: function (event, jsEvent, view) {
      }
    });
  }

  getAllEvents() {
    fetchAllEvents()
      .then(result => {
        this.allEvents = result.map(item => {
          return {
            id: item.Id,
            editable: true,
            title: item.Subject,
            start: item.ActivityDate,
            end: item.EndDateTime,
            description: item.Description,
            allDay: false,
            extendedProps: {
              whoId: item.WhoId,
              whatId: item.WhatId
            },
            backgroundColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")",
            borderColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
          };
        });
        // Initialise the calendar configuration
        this.initialiseFullCalendarJs();
      })
      .catch(error => {
        window.console.log(' Error Occured ', error)
      })
      .finally(() => {
        //this.initialiseFullCalendarJs();
      })
  }

  closeModal() {
    this.showDetail = false;
  }
}