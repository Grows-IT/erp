import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { SalesService } from '../sales.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Quotation } from '../sales.model';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuotationDialogComponent } from '../quotation-dialog/quotation-dialog.component';
import { InvoiceDetailComponent } from 'src/app/invoice/invoice-detail/invoice-detail.component';
import { CustomerService } from './../../customer/customer.service';
import { Customer } from 'src/app/customer/customer.model';
import { ItemsService } from 'src/app/items/items.service';
import { Item } from 'src/app/items/items.model';
import { FormArray } from '@angular/forms';
import { InvoicegroupComponent } from 'src/app/invoice/invoicegroup/invoicegroup.component';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { Invoice } from 'src/app/invoice/invoice.model';
import { SharedService } from 'src/app/shared/shared.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-quotationdetail',
  templateUrl: './quotationdetail.component.html',
  styleUrls: ['./quotationdetail.component.scss']
})
export class QuotationdetailComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  customerSubscription: Subscription;
  customers: Customer[];
  quotation: Quotation;
  listItem = [];
  product;
  isShow = false;
  items: Item[];
  total: number;
  subTotal: number;
  invoiceSubscription: Subscription;
  invoices: Invoice[];
  quotations: Quotation[];

  constructor(
    private invoiceService: InvoiceService,
    public dialog: MatDialog,
    private cService: CustomerService,
    private salesService: SalesService,
    private router: Router,
    private dialogRef: MatDialogRef<QuotationdetailComponent>,
    private sharedService: SharedService,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.data = this.dialogRef.componentInstance.data;

    this.invoiceSubscription = this.invoiceService.invoices.subscribe(invoices => {
      this.invoices = invoices;
    });

    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });

    this.itemsService.items.subscribe(items => {
      this.items = items;
    });
    this.itemsService.getAllItems().subscribe();

    this.subscription = this.salesService.quotations.subscribe(quotations => {
      this.quotations = quotations;
      if (quotations === null) {
        return;
      }
      this.quotation = quotations.find(q => q.id === this.data);
    });
    this.salesService.getQuotation().subscribe();
    this.invoiceService.getAllInvoice().subscribe();
    this.cService.getAllCustomer().subscribe();
    this.itemsService.getAllItems().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCustomer(customerId: string) {
    const customer = this.customers.find(cus => cus.id === customerId);
    if (!customer) {
      return null;
    }
    return customer;
  }

  getInvoice(quotationId: string) {
    const invoice = this.invoices.find(inv => inv.id === quotationId);
    if (!invoice) {
      return null;
    }
    return invoice.id;
  }

  getItems(itemId: string) {
    const product = this.items.find(pro => pro.id === itemId);
    if (!product) {
      return null;
    }
    return product;
  }

  invoiceDetail(id) {
    const dialogRef = this.dialog.open(InvoicegroupComponent, {
      panelClass: 'nopadding-dialog',
      width: '40vw',
      height: '70vh',
      disableClose: true,
      autoFocus: false,
      data: id
    });
  }

  formatDate(date: Date) {
    const d = new Date(date);
    return d.toDateString();
  }

  delete(id: string, invoiceId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '400px',
      height: '200px',
      disableClose: true,
      autoFocus: false,
      data: { id, invoiceId, 'from': 'quotation' }
    });
    // this.salesService.deleteQuotation(id, invoiceId).subscribe();
    this.dialogRef.close(() => {
      this.router.navigate(['/sales']);

    });
  }

  showItem() {
    this.isShow = !this.isShow;
  }

  close(): void {
    this.dialogRef.close();
  }

  // decode(id) {
  //   return this.sharedService.decode(id, this.quotation.count, 'Q');
  // }

  edit(quotation) {
    const dialogRef = this.dialog.open(QuotationDialogComponent, {
      panelClass: 'removespace',
      width: '40vw',
      height: '70vh',
      disableClose: true,
      autoFocus: false,
      data: this.quotation
    });
  }

  getDate(date: Date) {
    return this.formatDate(date);
  }

  getListItem(items) {
    this.total = 0;
    this.listItem = [];
    console.log(items.length);
    const products = [];
    for (let i = 0; i < items.length; i++) {
      const product = [
        [
          {
            text: this.getItems(items[i].itemId).name,
            style: 'itemTitle'
          },
          {
            text: 'Item Description',
            style: 'itemSubTitle'
          }
        ],
        {
          text: (items[i].quantity).toLocaleString(),
          style: 'itemNumber'
        },
        {
          text: this.getItems(items[i].itemId).price.toLocaleString(),
          style: 'itemNumber'
        },
        {
          text: '0%',
          style: 'itemNumber'
        },
        {
          text: '0%',
          style: 'itemNumber'
        },
        {
          text: (items[i].quantity * this.getItems(items[i].itemId).price).toLocaleString(),
          style: 'itemTotal'
        }
      ];
      this.total = (items[i].quantity * this.getItems(items[i].itemId).price),
        this.listItem.push(product);
      this.subTotal += this.total;
    }
  }

  openPdf(item: any) {
    this.subTotal = 0;
    this.getListItem(item.items);

    const documentDefinition = {
      content: [
        // Header
        {
          columns: [
            {
              image:
                'data:image/png;base64,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',
              width: 150
            },
            [
              {
                text: 'QUOTATION',
                style: 'quotationTitle',
                width: '*'
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: 'quotation #',
                        style: 'quotationSubTitle',
                        width: '*'
                      },
                      {
                        text: this.sharedService.decode(item.id, item.count, 'Q'),
                        style: 'quotationSubValue',
                        width: 100
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Date Issued',
                        style: 'quotationSubTitle',
                        width: '*'
                      },
                      {
                        text: this.getDate(this.quotation.date),
                        style: 'quotationSubValue',
                        width: 100
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Due Date',
                        style: 'quotationSubTitle',
                        width: '*'
                      },
                      {
                        text: this.getDate(this.quotation.expirationDate),
                        style: 'quotationSubValue',
                        width: 100
                      }
                    ]
                  }
                ]
              }
            ]
          ]
        },
        // Billing Headers
        {
          columns: [
            {
              text: 'Billing From',
              style: 'quotationBillingTitle'
            },
            {
              text: 'Billing To',
              style: 'quotationBillingTitle'
            }
          ]
        },
        // Billing Details
        {
          columns: [
            {
              text: 'Your Name \n Your Company Inc.',
              style: 'quotationBillingDetails'
            },
            {
              text: this.getCustomer(item.customerId).name,
              style: 'quotationBillingDetails'
            }
          ]
        },
        // Billing Address Title
        {
          columns: [
            {
              text: 'Address',
              style: 'quotationBillingAddressTitle'
            },
            {
              text: 'Address',
              style: 'quotationBillingAddressTitle'
            }
          ]
        },
        // Billing Address
        {
          columns: [
            {
              text: '9999 Street name 1A \n New-York City NY 00000 \n   USA',
              style: 'quotationBillingAddress'
            },
            {
              text: this.getCustomer(this.quotation.customerId).address,
              style: 'quotationBillingAddress'
            }
          ]
        },
        // Line breaks
        '\n\n',
        // Items
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 40, 'auto', 40, 'auto', 80],

            body: [
              // Table Header
              [
                {
                  text: 'Product',
                  style: 'itemsHeader'
                },
                {
                  text: 'Qty',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Price',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Tax',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Discount',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Total',
                  style: ['itemsHeader', 'center']
                }
              ],
              // Items
              // Item 1
              ...this.listItem,

              // [
              //   [
              //     {
              //       text: 'Item 1',
              //       style: 'itemTitle'
              //     },
              //     {
              //       text: 'Item Description',
              //       style: 'itemSubTitle'
              //     }
              //   ],
              //   {
              //     text: '1',
              //     style: 'itemNumber'
              //   },
              //   {
              //     text: '$999.99',
              //     style: 'itemNumber'
              //   },
              //   {
              //     text: '0%',
              //     style: 'itemNumber'
              //   },
              //   {
              //     text: '0%',
              //     style: 'itemNumber'
              //   },
              //   {
              //     text: '$999.99',
              //     style: 'itemTotal'
              //   }
              // ],
              // // Item 2
              // [
              //   [
              //     {
              //       text: 'Item 2',
              //       style: 'itemTitle'
              //     },
              //     {
              //       text: 'Item Description',
              //       style: 'itemSubTitle'
              //     }
              //   ],
              //   {
              //     text: '1',
              //     style: 'itemNumber'
              //   },
              //   {
              //     text: '$999.99',
              //     style: 'itemNumber'
              //   },
              //   {
              //     text: '0%',
              //     style: 'itemNumber'
              //   },
              //   {
              //     text: '0%',
              //     style: 'itemNumber'
              //   },
              //   {
              //     text: '$999.99',
              //     style: 'itemTotal'
              //   }
              // ]
              // END Items
            ]
          } // table
          //  layout: 'lightHorizontalLines'
        },
        // TOTAL
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 0,
            widths: ['*', 80],

            body: [
              // Total
              [
                {
                  text: 'Subtotal',
                  style: 'itemsFooterSubTitle'
                },
                {
                  text: this.subTotal.toLocaleString(),
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'Tax 7%',
                  style: 'itemsFooterSubTitle'
                },
                {
                  text: ((this.subTotal * 7) / 100).toLocaleString(),
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'TOTAL',
                  style: 'itemsFooterTotalTitle'
                },
                {
                  text: (this.subTotal + ((this.subTotal * 7) / 100)).toLocaleString(),
                  style: 'itemsFooterTotalValue'
                }
              ]
            ]
          }, // table
          layout: 'lightHorizontalLines'
        },
        // Signature
        {
          columns: [
            {
              text: ''
            },
            {
              stack: [
                {
                  text: '_________________________________',
                  style: 'signaturePlaceholder'
                },
                {
                  text: 'Your Name',
                  style: 'signatureName'
                },
                {
                  text: 'Your job title',
                  style: 'signatureJobTitle'
                }
              ],
              width: 180
            }
          ]
        },
        {
          text: 'NOTES',
          style: 'notesTitle'
        },
        {
          text: 'Some notes goes here \n Notes second line',
          style: 'notesText'
        }
      ],
      styles: {
        // Document Header
        documentHeaderLeft: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'left'
        },
        documentHeaderCenter: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'center'
        },
        documentHeaderRight: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'right'
        },
        // Document Footer
        documentFooterLeft: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'left'
        },
        documentFooterCenter: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'center'
        },
        documentFooterRight: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'right'
        },
        // quotation Title
        quotationTitle: {
          fontSize: 22,
          bold: true,
          alignment: 'right',
          margin: [0, 0, 0, 15]
        },
        // quotation Details
        quotationSubTitle: {
          fontSize: 12,
          alignment: 'right'
        },
        quotationSubValue: {
          fontSize: 12,
          alignment: 'right'
        },
        // Billing Headers
        quotationBillingTitle: {
          fontSize: 14,
          bold: true,
          alignment: 'left',
          margin: [0, 20, 0, 5]
        },
        // Billing Details
        quotationBillingDetails: {
          alignment: 'left'
        },
        quotationBillingAddressTitle: {
          margin: [0, 7, 0, 3],
          bold: true
        },
        quotationBillingAddress: {},
        // Items Header
        itemsHeader: {
          margin: [0, 5, 0, 5],
          bold: true
        },
        // Item Title
        itemTitle: {
          bold: true
        },
        itemSubTitle: {
          italics: true,
          fontSize: 11
        },
        itemNumber: {
          margin: [0, 5, 0, 5],
          alignment: 'center'
        },
        itemTotal: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center'
        },

        // Items Footer (Subtotal, Total, Tax, etc)
        itemsFooterSubTitle: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'right'
        },
        itemsFooterSubValue: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center'
        },
        itemsFooterTotalTitle: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'right'
        },
        itemsFooterTotalValue: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center'
        },
        signaturePlaceholder: {
          margin: [0, 70, 0, 0]
        },
        signatureName: {
          bold: true,
          alignment: 'center'
        },
        signatureJobTitle: {
          italics: true,
          fontSize: 10,
          alignment: 'center'
        },
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3]
        },
        notesText: {
          fontSize: 10
        },
        center: {
          alignment: 'center'
        }
      },
      defaultStyle: {
        columnGap: 20
      }
    };
    pdfMake.createPdf(documentDefinition).open();
    // console.log(documentDefinition);
  }
}
