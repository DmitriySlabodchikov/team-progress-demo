import {JetView} from "webix-jet";

export default class NewReportPopup extends JetView {
	config(){
		const _ = this.app.getService("locale")._;

		return {
			view:"window",
			height:600,
			position:"center",
			modal:true,
			head:_("Generate report"),
			body:{
				view:"form",
				width:500,
				localId:"form",
				elementsConfig:{ labelPosition:"top" },
				rows:[
					{ view:"textarea", label:_("Notes about total tasks completed"), name:"completedTasks" },
					{ view:"textarea", label:_("Notes about hours spent"), name:"hoursSpent" },
					{ view:"textarea", label:_("Notes about individual employee's progress"), name:"progress" },
					{ view:"textarea", label:_("Notes about all tasks"), name:"tasks" },
					{ view:"textarea", label:_("Notes about total tasks by projects"), name:"compare" },
					{
						cols:[
							{
								view:"button", value:_("Cancel"),
								click:() => this.getBack()
							},
							{
								view:"button", value:_("Generate"), type:"form",
								click:() => this.saveTask()
							}
						]
					}
				],
				rules:{

				}
			}
		};
	}
	showWindow(){
		this.getRoot().show();
	}
	getBack(){
		this.getRoot().hide();
		this.$$("form").clear();
		this.$$("form").clearValidation();
	}
	getTextConfig(text, before){
		const textAlign = before ? "center" : "left";
		const fontSize = before ? 15 : 13;
		return {
			text: text,
			options:{
				color:0x666666, textAlign:textAlign, fontSize:fontSize
			}
		}
	}
	saveTask(){
		const notes = this.$$("form").getValues();
		const _ = this.app.getService("locale")._;

		let data = {
			views:{}
		};

		this.app.callEvent("get:report:views", [data]);

		const person = data.person;
		const views = data.views;

		webix.toPDF(
			[
				{
					id: views.completedTasks,
					options: {
						textBefore: this.getTextConfig(_("Total tasks comleted"),true),
						textAfter: this.getTextConfig(notes.completedTasks)
					}
				},
				{
					id: views.compare,
					options: {
						textBefore: this.getTextConfig(_("Total tasks by projects"),true),
						textAfter: this.getTextConfig(notes.compare)
					}
				},
				{
					id: views.hoursSpent,
					options: {
						textBefore: this.getTextConfig(_("Hours spent, %"),true),
						textAfter: this.getTextConfig(notes.hoursSpent)
					}
				},
				{
					id: views.progress,
					options: {
						textBefore: this.getTextConfig(_("Individual employee's progress"),true),
						textAfter: this.getTextConfig(notes.progress)
					}
				},
				{
					id: views.tasks,
					options: {
						textBefore: this.getTextConfig(_("All tasks"),true),
						textAfter: this.getTextConfig(notes.tasks),
						display: "table",
						ignore: { "status":true }
					}
				}
			],
			{
				filename:"report_"+person.fname+"_"+person.lname,
				autowidth:true,
				display:"image",
				docHeader: person.fname+" "+person.lname,
				docHeaderImage:"data/photos/"+person.photo+".jpg"
			}
		);
		this.getBack();
	}
}
