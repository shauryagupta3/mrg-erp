export namespace data {
	
	export class Attachment {
	    ID: number;
	    Uuid: string;
	    Type: string;
	    FileName: string;
	    FileType: string;
	    FileSize: number;
	    Persondataid: number;
	    Createdat: sql.NullTime;
	
	    static createFrom(source: any = {}) {
	        return new Attachment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Uuid = source["Uuid"];
	        this.Type = source["Type"];
	        this.FileName = source["FileName"];
	        this.FileType = source["FileType"];
	        this.FileSize = source["FileSize"];
	        this.Persondataid = source["Persondataid"];
	        this.Createdat = this.convertValues(source["Createdat"], sql.NullTime);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Person {
	    ID: number;
	    Uuid: string;
	    Name: string;
	    Sex: string;
	    DateOfBirth: time.Time;
	    PlaceOfBirth: string;
	    FatherName: string;
	    Contact: string;
	    OccupationType: string;
	    Budget: number;
	    AnnualIncome: number;
	    Notes: string;
	    Createdat: sql.NullTime;
	    Modifiedat: sql.NullTime;
	
	    static createFrom(source: any = {}) {
	        return new Person(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Uuid = source["Uuid"];
	        this.Name = source["Name"];
	        this.Sex = source["Sex"];
	        this.DateOfBirth = this.convertValues(source["DateOfBirth"], time.Time);
	        this.PlaceOfBirth = source["PlaceOfBirth"];
	        this.FatherName = source["FatherName"];
	        this.Contact = source["Contact"];
	        this.OccupationType = source["OccupationType"];
	        this.Budget = source["Budget"];
	        this.AnnualIncome = source["AnnualIncome"];
	        this.Notes = source["Notes"];
	        this.Createdat = this.convertValues(source["Createdat"], sql.NullTime);
	        this.Modifiedat = this.convertValues(source["Modifiedat"], sql.NullTime);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace sql {
	
	export class NullTime {
	    Time: time.Time;
	    Valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new NullTime(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Time = this.convertValues(source["Time"], time.Time);
	        this.Valid = source["Valid"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace time {
	
	export class Time {
	
	
	    static createFrom(source: any = {}) {
	        return new Time(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

