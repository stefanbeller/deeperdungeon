/*
Copyright (c) <2013>, <Patrick Jebramcik>
Copyright (c) <2013>, <Dietrich Derksen>
Copyright (c) <2013>, <Florian Kraus>
Copyright (c) <2013>, <Jessica Tölke>
Copyright (c) <2013>, <Stefan Beller>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer
      in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var COOKIE_EXPIRE_DAYS = 1000;

function savegame() {
	this.saveobj = new Array();
	this.saveValues = new Array();
	this.saveValueNames = new Array();
	this.saveGameString = "";

	this.save = function() {
		for(var i=0; i<this.saveobj.length; i++) {
			if(this.saveobj[i].save)
				this.saveobj[i].save(this);
		}
		var savedate = new Date();
		this.putValue("saveDay", savedate.toLocaleDateString());
		this.putValue("saveTime", savedate.getHours() + ":" + savedate.getMinutes());
		var s="";
		for(var i=0; i<this.saveValues.length; i++) {
			if(i>0)
				s+= "&";
			s += this.saveValueNames[i] + "=" + this.saveValues[i];
		}

		var exdate=new Date();
		exdate.setDate(exdate.getDate() + COOKIE_EXPIRE_DAYS);

		this.saveGameString = s;
		document.cookie = "savegame=" + s + "; expires=" + exdate.toUTCString() + "; host=localhost";
	}

	this.parseString = function(s) {
		this.clear();
		var i = s.indexOf("savegame=")
		if(i >= 0) {
			s = s.slice(i + 9);
		}
		s = "&" + s;
		i = 0;
		while(i >= 0) {
			var next_i = s.indexOf("&", i+1);
			var current;
			if(next_i > -1)
				current = s.slice(i+1, next_i);
			else
				current = s.slice(i+1);

			if(current != "") {
				var eq = current.indexOf("=");
				var name = current.slice(0, eq);
				var value = current.slice(eq+1);
				var idx = this.saveValues.length;
				this.saveValues[idx] = value;
				this.saveValueNames[idx] = name;
			}
			i = next_i;
		}
	}

	this.parseData = function() {
		this.parseString(document.cookie);
	}

	this.deleteData = function() {
		this.clear();
		document.cookie = "savegame=";
	}

	this.notifyLoadObservers = function() {
		for(var i=0; i<this.saveobj.length; i++) {
			if(this.saveobj[i].load)
				this.saveobj[i].load(this);
		}
	}

	this.load = function() {
		this.parseData();
		this.notifyLoadObservers();
	}

	this.loadString = function(str) {
		this.parseString(str);
		this.notifyLoadObservers();
	}

	this.getSaveGameString = function() {
		return this.saveGameString;
	}

	this.isDataAvailable = function() {
		if (!document.cookie || document.cookie == "")
			return false;

		this.parseData();
		return this.getBool("saveDay");
	}

	this.clear = function() {
		this.saveValues = new Array();
		this.saveValueNames = new Array();
	}

	this.addObj = function(obj) {
		this.saveobj[this.saveobj.length] = obj;
	}

	this.putValue = function(name, value) {
		var i = this.saveValueNames.indexOf(name);
		if(i<0)
			i = this.saveValues.length;
		this.saveValues[i] = value;
		this.saveValueNames[i] = name;
	}

	// returns null on failure
	this.getValue = function(name) {
		var i=this.saveValueNames.indexOf(name);
		return this.saveValues[i];
	}

	// returns 0 on failure
	this.getInt = function(name) {
		var i=this.saveValueNames.indexOf(name);
		if(i>-1) {
			return parseInt(this.saveValues[i]);
		} else {
			return 0;
		}
	}
	// returns 0 on failure
	this.getFloat = function(name) {
		var i=this.saveValueNames.indexOf(name);
		if(i>-1) {
			return parseFloat(this.saveValues[i]);
		} else {
			return 0;
		}
	}

	//
	this.getBool = function(name) {
		var i=this.saveValueNames.indexOf(name);
		if(i>-1) {
			return parseInt(this.saveValues[i]) != 0;
		} else {
			return 0;
		}
	}
}
