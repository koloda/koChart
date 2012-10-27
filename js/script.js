var inputData = {data:{'girls':186, 'beer':237, 'milk':95, 'food':140, 'rent':223}, labels:{x:'Things', y:'Money', header:'My finances'} }

var inputDataH = {data:{
	 'girls':[391,186,123,354,345,167],
	 'beer':[237,434,391,325,122,453],
	 'milk':[95,391,160,532,256,343], 
	 'food':[140,52,417,391,390,211], 
	 'rent':[223,323,240,391,190,145]}, 

	 labels:{x:'Things', y:'Money', header:'My finances'}, data_x:[0,1,2,3,4,5] }

				function koChart(id){this.selectorId = id;}

				koChart.prototype = {
					colors:['#ffed00', '#48d500', '#bd0999', '#004fff', '#ff7c00', '#00993d', '#a100d1', '#00ccff'],
					init:function(inputData, options){
						this.max = 0;
						this.min = 0;
						this.summ = 0;
						this.thingsCount = 0;

						if (options.chartType != 'histogramm')
							for (var item in  inputData.data)
							{
								if (inputData.data[item] > this.max)
									this.max = inputData.data[item];
								if (inputData.data[item] < this.min)
									this.min = inputData.data[item];
								this.summ += (inputData.data[item]);
								this.thingsCount ++;
							}
						else
						{
							var fullArr = [];
							for (var item in  inputData.data)
							{
								console.log(inputData.data[item]);
								fullArr = fullArr.concat(inputData.data[item])
								//this.summ += (inputData.data[item]);
								this.thingsCount ++;
							}
							console.log(fullArr);
							this.max = Math.max.apply(null, fullArr);
							this.min = Math.min.apply(null, fullArr);
						}

						this.inputData = inputData;

						var cnvs = document.getElementById(this.selectorId);	
						this.ok = false;
						this.options = options;

						console.log(this.options)


						if (cnvs.getContext)
						{
							this.ctx = cnvs.getContext('2d');
							this.ok = true;

							this.cX = this.ctx.canvas.width/2;
							this.cY = this.ctx.canvas.height/2;

							this.f1 = Math.floor(this.ctx.canvas.height*0.08)+'px sans-serif';
							this.f2 = Math.floor(this.ctx.canvas.height*0.06)+'px sans-serif';
							this.f3 = Math.floor(this.ctx.canvas.height*0.04)+'px sans-serif';

							this.ctx.lineCap = 'round';

							this.createChart();
						}


					},
					
					createChart:function(){
						console.log(this.options)
						switch (this.options.chartType)
						{
							case 'pie':
								this.drawPieChart();
							break;

							case 'bar':
								this.drawBarChart();
							break;

							case 'histogramm':
								this.drawHistogramm();
							break;

							default:
								this.drawPieChart();
							break;
						}
					},

					drawBarChart:function(){
						//drawing coord.lines
						this.drawLines();

						// drawing labels
						this.drawChartLabels();

						this.barWidth = Math.floor( this.diagramm.width/ (this.thingsCount*(1.28) + 0.28) );
						this.barMargin = Math.floor(this.barWidth*0.28);


						//drawing bars
						var n=0;
						for (var item in this.inputData.data)
						{
							this.drawBar({label:item, value:this.inputData.data[item], n:n});
							n++;
						}
					},

					drawHistogramm:function(){
						this.drawLines();
						this.drawChartLabels();

						var n=0;
						for (var item in this.inputData.data)
						{
							this.drawHisto({label:item, value:this.inputData.data[item], n:n});
							n++;
						}	
					},

					//todo: rename this f-n
					drawLines:function(){

						//vertical line
						var v = new Object();
						v.ty  = Math.floor(this.cY*0.4);
						v.tx  = Math.floor(this.cX*0.3);
						if (this.options.chartType == 'histogramm')
							v.by  = Math.floor(2*this.cY*0.8);
						else
							v.by  = Math.floor(2*this.cY*0.9);
						v.bx  = v.tx;

						var h = new Object();
						h.lx = v.bx;
						h.ly = v.by;
						h.rx = Math.floor(2*this.cX*0.95);
						h.ry = h.ly;

						this.ctx.strokeStyle = '#666';
						this.ctx.lineWidth = 2;

						this.ctx.moveTo(v.tx, v.ty);
						this.ctx.lineTo(v.bx, v.by);

						this.ctx.moveTo(h.lx, v.ly);
						this.ctx.lineTo(h.rx, h.ry);

						this.ctx.stroke();


						this.diagramm = new Object;

						this.diagramm.height = v.by - v.ty;
						this.diagramm.width = h.rx - h.lx;
						this.diagramm.bottom = v.by;
						this.diagramm.left = v.bx;
						this.diagramm.top = v.ty;

						console.log(this.diagramm);

						console.log(this.max);
						console.log( Math.floor(Math.log(this.max)/Math.log(10)));
						this.yStep = parseInt(this.max.toString()[0])>=5?Math.pow(10, Math.floor(Math.log(this.max)/Math.log(10))):Math.pow(10, Math.floor(Math.log(this.max)/Math.log(10)))/2;

						this.max0y = Math.ceil(this.max/this.yStep)*this.yStep;

						console.log(this.max0y);

						this.kY = this.diagramm.height/(1.1*this.max0y);

						if(this.inputData.data_x)
							this.xStep = this.diagramm.width/(this.inputData.data_x.length-1);

						this.ctx.fillStyle = '#666';
						var y=0;

						console.log(this.ctx.font);
						while (y<this.max+this.yStep)						
						{
							this.ctx.moveTo(this.diagramm.left-3, this.yToGy(y));
							this.ctx.lineTo(this.diagramm.left, this.yToGy(y));
							this.ctx.stroke();

							this.drawLabelLeft(y.toString(), this.diagramm.left-5, this.yToGy(y)+3);
							y += this.yStep; 
						}

						// console.log({m:this.max, k:this.kY});



						//drawing 0x labels


					},

					drawChartLabels:function(){

						//draw main label
						// console.log('-----------------'+this.f1);
						this.ctx.font=this.f1;
						this.ctx.fillStyle = '#333';

						this.ctx.fillText(this.inputData.labels.header, 10, this.ctx.canvas.height*0.08);
						
						//
						this.ctx.font=this.f2;
						this.ctx.fillStyle = '#666';

						this.ctx.fillText(this.inputData.labels.y, (this.diagramm.left-this.inputData.labels.y.length*6)/2 , this.diagramm.top-10);

						if (this.options.chartType == 'histogramm')
						{
							this.ctx.font = this.f3;
							for(var i=0; i<this.inputData.data_x.length; i++)
							{
								this.ctx.fillStyle = '#333';
								this.ctx.moveTo(this.diagramm.left + i*this.xStep, this.diagramm.bottom);
								this.ctx.lineTo(this.diagramm.left + i*this.xStep, this.diagramm.bottom+3);
								this.ctx.stroke();

								this.ctx.fillStyle = '#666';
								this.ctx.fillText(this.inputData.data_x[i], this.diagramm.left + i*this.xStep - this.inputData.data_x[i].toString().length*6/2, this.diagramm.bottom+20);	
							}
							this.ctx.font=this.f2;
							this.ctx.fillText(this.inputData.labels.x, this.diagramm.left + ( this.diagramm.width - this.inputData.labels.y.length*6)/2 , this.diagramm.bottom + this.ctx.canvas.height*0.15);
						}
						else
							this.ctx.fillText(this.inputData.labels.x, this.diagramm.left + ( this.diagramm.width - this.inputData.labels.y.length*6)/2 , this.diagramm.bottom + this.ctx.canvas.height*0.07);

					},

					drawBar:function(d){
						this.ctx.font=this.f2;
						// this.ctx.beginPath();
						this.ctx.fillStyle = '#00aadd';
						var tx = this.diagramm.left + d.n*(this.barWidth+this.barMargin) + this.barMargin;
						var ty = this.yToGy(d.value);
						var bx = this.barWidth;
						var by = d.value*this.kY -1;
						this.ctx.fillRect(tx,ty,bx,by);
						// this.ctx.closePath();
						// this.ctx.fill();
						
						this.ctx.fillStyle = '#666';
						this.ctx.fillText(d.label, tx + Math.floor( (this.barWidth - d.label.length*6)/2) , ty-20);
						this.ctx.fillText(d.value, tx + Math.floor( (this.barWidth - d.value.toString().length*7)/2) , ty-3);
						//console.log([bx,by,tx,ty]);
					},

					drawHisto:function(d){
						this.ctx.strokeStyle = this.colors[d.n];
						this.ctx.lineWidth = 3;
						this.ctx.beginPath()
						this.ctx.moveTo(this.diagramm.left, this.yToGy(d[0]));
						for (var i=0; i<d.value.length; i++)
							this.ctx.lineTo(this.diagramm.left+i*this.xStep, this.yToGy(d.value[i]));
						this.ctx.stroke();
						this.ctx.closePath();
						
					},

					drawLabelLeft:function (str, x, y){
						this.ctx.fillText(str, x-str.length*6, y);
					},

					yToGy:function(val){
						return Math.floor(this.diagramm.height - val*this.kY) + this.diagramm.top -1; 
					},

					drawSector:function(d){
						var angle = this.prevAngle+Math.PI*2*d.percent/100;
						this.ctx.beginPath();
						this.ctx.lineWidth = 4;
						this.ctx.strokeStyle = 'white';
						var color = 'rgb(50,'+Math.floor(55 + d.percent*200/100) +', ' + Math.floor(200 + d.percent*55/100) +')';
						// console.log(color);
						this.ctx.fillStyle = color;

						this.ctx.arc(this.cX,this.cY,this.R, this.prevAngle, angle, 0);
						this.ctx.lineTo(this.cX, this.cY);
						this.ctx.closePath();
						this.ctx.fill();
						this.ctx.stroke();
						
						
						
						this.prevAngle = angle;

						this.ctx.beginPath();
						this.ctx.strokeStyle = '#ccc';
						var middle = Math.PI*d.percent/100;
						this.ctx.lineWidth = 2;
						this.ctx.moveTo(this.cX+this.R*0.6*Math.cos(this.prevAngle-middle), this.cY+this.R*0.6*Math.sin(this.prevAngle-middle));


						this.ctx.beginPath();
						this.ctx.fillStyle = '#ccc';

						this.ctx.arc(this.cX+this.R*0.6*Math.cos(this.prevAngle-middle), this.cY+this.R*0.6*Math.sin(this.prevAngle-middle),4, 0, 2*Math.PI, 0);
						this.ctx.moveTo(this.cX+this.R*0.6*Math.cos(this.prevAngle-middle), this.cY+this.R*0.6*Math.sin(this.prevAngle-middle));
						this.ctx.closePath();
						// this.ctx.lineTo(300, 200);
						// this.ctx.closePath();
						this.ctx.fill();

						// this.ctx.lineTo( 300+180*Math.cos(prevAngle-middle), 200+180*Math.sin(prevAngle-middle));

						if (this.prevAngle - middle>Math.PI )
							var lY = this.cY+this.R*0.6*Math.sin(this.prevAngle-middle)-30;
						else
							var lY = this.cY+this.R*0.6*Math.sin(this.prevAngle-middle)+30;
							
						this.ctx.lineTo(this.cX+this.R*0.6*Math.cos(this.prevAngle-middle), lY);

						this.ctx.fillStyle = '#666';
						if (this.prevAngle - middle>3*Math.PI/2 || this.prevAngle - middle<Math.PI/2) 
						{
							this.ctx.lineTo( 2*this.cX-10, lY);
							var str = d.label + ' ('+ Math.round(10*d.percent)/10 +'%)';
							this.ctx.fillText(str , 2*this.cX-this.ctx.canvas.width*0.01 - str.length*this.ctx.canvas.width*0.019, lY - 5);
						}
						else
						{
							this.ctx.lineTo( 10, lY);
							var str = d.label + ' ('+ Math.round(10*d.percent)/10 +'%)';
							this.ctx.fillText(str, 10, lY - 5);
						}
						// console.log(prevAngle);

						this.ctx.stroke();
						this.ctx.closePath();
					},

					drawPieChart:function(){
					
						this.ctx.lineWidth = 5;
						this.ctx.strokeStyle = 'white';
						this.ctx.font=this.f2;
						this.prevAngle = 0;

						// console.log(this.ctx);
						this.cX = this.ctx.canvas.width/2;
						this.cY = this.ctx.canvas.height/2;
						this.R = Math.floor(this.cY*0.7);

						// console.log(cX);
						// console.log(cY);
						// console.log(R);

						for (var item in  inputData.data)
							this.drawSector( {label:item, val:inputData.data[item], percent:100*inputData.data[item]/this.summ});
					}
				}

					// myPieChart = new koChart(inputData, {chartType:'pie'}); 
					// myPieChart.init();