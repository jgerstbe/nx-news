import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application, ItemEventData, Utils } from "@nativescript/core";
import { NewsService } from "../api/news.service";
import { registerElement } from "@nativescript/angular";
registerElement("PullToRefresh", () => require("@nstudio/nativescript-pulltorefresh").PullToRefresh);

@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    items: any[] = [];

    constructor(
        private newsService: NewsService,
    ) { }

    ngOnInit(): void {
        this.newsService.getUnreadArticles().subscribe(
            (data:any) => {
                console.log('DATA', data.items ? data.items.length : null);
                this.items = data.items;
            },
            error => console.error(error)
        );
    }

    refreshList(args) {
        console.warn('refreshList')
        const pullRefresh = args.object;
        setTimeout(function () {
            pullRefresh.refreshing = false;
        }, 1000);
    }

    onItemTap(args: ItemEventData) {
        const item = this.items[args.index];
        console.log(`Index: ${args.index}; View: ${args.view} ; Item: ${item.id} - ${item.title}`);
        // mark as read
        this.newsService.markAsRead(item.id).subscribe(
            data => console.log(`Read item ${item.id}`),
            error => console.error(`Could not mark item as read: ${item.id}`, error)
        );
        // open browser
        // TODO offer quickview via settings
        Utils.openUrl(item.url);
        setTimeout(() => this.deleteItemLocally(item.id), 1500);
    }

    deleteItemLocally(itemId:number) {
        const index = this.items.findIndex(e => e.id === itemId);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    onLoadMoreItems(event: any) {
        console.warn('onLoadMoreItems', event);
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }
}
