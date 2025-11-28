import { Component } from '@angular/core';

@Component({
  selector: 'app-companies',
  imports: [],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class Companies {
   companyList = [
    { title: 'MNCs', count: '1.8K+' },
    { title: 'Internet', count: '195' },
    { title: 'Manufacturing', count: '799' },
    { title: 'Fortune 500', count: '136' },
    { title: 'Product', count: '980' },
    { title: 'Banking & Finance', count: '340' },
    { title: 'Hospitality', count: '73' },
    { title: 'Fintech', count: '108' },
    { title: 'FMCG & Retail', count: '118' },
    { title: 'Startups', count: '618' },
    { title: 'Edtech', count: '143' },
    { title: 'B2C', count: '1.9K+' },
    { title: 'Healthcare', count: '532' },
    { title: 'Unicorns', count: '66' }
  ];
   filterOptions = [
    { label: 'Company Type', open: true, options: ['MNC', 'Startup', 'Product', 'Government'] },
    { label: 'Industry', open: false, options: ['IT', 'Finance', 'Healthcare', 'Automobile'] },
    { label: 'Location', open: false, options: ['Mohali', 'Noida', 'Bangalore', 'Gurgaon'] },
    { label: 'Department', open: false, options: ['Development', 'Sales', 'Support'] },
    { label: 'Experience', open: false, options: ['0-1 Years', '1-3 Years', '3-5 Years'] },
    { label: 'Nature of Business', open: false, options: ['B2B', 'B2C', 'Hybrid'] },
    { label: 'Job Posting Date', open: false, options: ['Last 1 Day', 'Last 3 Days', 'Last 7 Days'] }
  ];
  companySlides: any[] = [];
    
  companies = [
    {
      name: 'Smith Nephew',
      rating: 4.2,
      reviews: 9004,
      tag: 'Corporate',
      industry: 'Medical / Healthcare',
      founded: 2000,
      employees: '10K-50K',
      business: ['B2B', 'B2C']
    },
    {
      name: 'Oxygen Healthcare',
      rating: 4.1,
      reviews: 7211,
      tag: 'MNC',
      industry: 'Healthcare Tech',
      founded: 2010,
      employees: '5K-10K',
      business: ['B2B']
    },
    {
      name: 'Inspirisys',
      rating: 4.0,
      reviews: 6441,
      tag: 'Services',
      industry: 'IT Services',
      founded: 1995,
      employees: '15K-30K',
      business: ['B2B', 'B2C']
    }
  ];
  categories = [
    'MNC', 'Product', 'Startup', 'Fintech',
    'Automobile', 'IT Services', 'EdTech', 'Sales'
  ];
  constructor() {
    this.createSlides();
  }
    createSlides() {
    const chunkSize = 5;
    for (let i = 0; i < this.companyList.length; i += chunkSize) {
      this.companySlides.push(this.companyList.slice(i, i + chunkSize));
    }
  }
} 
