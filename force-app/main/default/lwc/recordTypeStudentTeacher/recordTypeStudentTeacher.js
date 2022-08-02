import { LightningElement} from 'lwc';
export default class RecordTypeStudentTeacher extends LightningElement {
        teacherView = false;
        studentview = false;

    get options() {
        return [
            { label: 'Teacher', value: 'Teacher' },
            { label: 'Student/Parents', value: 'Student/Parents' }
        ];
        
    }

    get options1() {
        return [
            { label: 'Maths', value: 'Maths' },
            { label: 'Science', value: 'Science' },
            { label: 'Social', value: 'Social' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }


    handleChange(event){
        if(event.target.value=='Teacher'){
            this.teacherView = true;
            this.studentview = false;
        }
        if(event.target.value=='Student/Parents')
        {
            this.teacherView = false;
            this.studentview=true;
        }
        
    }
    
}

// import { LightningElement } from 'lwc';
// export default class TemplateIFTrueExampleLWC extends LightningElement {
//     areDetailsVisible = false;
//     aredetailsavailable = true;
//     handleChange(event) {
//         this.areDetailsVisible = event.target.checked;
//         this.aredetailsavailable = event.target.checked;
//     }
// }
    


//get options() {
    //         return [
    //             { label: 'Teacher', value: 'Teacher' },
    //             { label: 'Student/Parent', value: 'Student/Parent' },
    //         ];
    //     }