var budgetController = (function ()
{
    function Expense(id,description,value){
        
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentages = function(totalIncome)
    {   if(totalIncome > 0)
        {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else{
            this.percentage = -1;
        }
    };
   
    Expense.prototype.getPercentage = function(){

        return this.percentage;

    }


    function Income(id,description,value){
        
        this.id = id;
        this.description = description;
        this.value = value;
        
    };
    
    var calculateTotal = function(type){

        var sum = 0;
        data.allItems[type].forEach(function(cur){

            sum = sum + cur.value;

        });
        data.totalItems[type]=sum;
    };
    
    var data = {
        allItems : {
            inc:[],
             exp:[]            
            
        },
        totalItems : 
        {
         exp :0,
         inc : 0
        },
        budget:0,
        percentage:-1
        
    };
        
    return {
        
        addItem : function (type,des,value){    
            var newItem, ID ;               
            //create new id
            if (data.allItems[type].length > 0)
            {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else
            {
                    ID = 0;
            }
            // create new item based upon 'inc' or 'exp'
            if(type === 'inc')
            {        
                newItem = new Income(ID,des,value);                    
            }
            else if (type === 'exp')
            {    
                newItem = new Expense(ID, des,value);       
            }
                
            // push it into array    
            data.allItems[type].push(newItem);
            //returning new element
            return newItem;
        },
        
        deleteItem : function(type,id){
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });
           var  index = ids.indexOf(id);
            if(index !== -1)
            {
                data.allItems[type].splice(index,1);
            }

        },

        calculateBudget : function(){
            calculateTotal('exp');
            
            calculateTotal('inc');
            
            data.budget = data.totalItems.inc - data.totalItems.exp;
            if(data.totalItems.inc > 0)
            {
                data.percentage = Math.round((data.totalItems.exp / data.totalItems.inc) * 100);
            } 
            else
            {
                data.percentage=-1;
            }  
        },

        calculatePercentages : function(){

            data.allItems.exp.forEach(function(cur)
            {
                cur.calcPercentages(data.totalItems.inc);
            });
        },

        getPercentages : function()
        {
            var allPerc = data.allItems.exp.map(function(cur)
            {               
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        getBudget : function(){
            return{
                    budget:data.budget,
                    totalINC :data.totalItems.inc,
                    totalEXP : data.totalItems.exp, 
                    percentage : data.percentage        
            }
            
        },      
        
        testing : function()
        {          
            console.log(data);
        }
    };         
    

})();


var UIController = (function()
{
    
     var DomStrings = {
        
        inputtype : '.add__type',
        inputDescription :'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dataLabel:'.budget__title--month'
        };
       
        var formatNumber = function(num,type)
        {
            num = Math.abs(num);
            num = num.toFixed(2);
            var numSplit = num.split('.');
            int = numSplit[0];
            if(int.length > 3)
            {
                int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);
            }  
            dec=numSplit[1];
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.'+ dec ;


        };

        var nodeListForEach = function(list,callBack){
            for (var i = 0 ; i < list.length; i++ )
            {
                callBack(list[i],i);
            }
        };
    
    
    return {

        getInput: function(){
            return {
                 type: document.querySelector(DomStrings.inputtype).value, // Will be either inc or exp
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value)  
            };
            
            
        },
        
        addListItem: function (obj,type){
           
            //create html string with placeholder
            
            var html,newhtml,element;
            
            if(type === 'inc')
            {
                element = DomStrings.incomeContainer;    
                html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp')
            {
               element = DomStrings.expensesContainer;   
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newhtml = html.replace('%id%',obj.id);

            newhtml = newhtml.replace('%description%',obj.description);

            newhtml = newhtml.replace('%value%',formatNumber(obj.value,type));
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);    
            
        },
        
        deleteListItem : function(selectorID)
        {
           var element = document.getElementById(selectorID);
           element.parentNode.removeChild(element);     
        },
        
        clearFields: function() {
            
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        

        displayBudget: function(obj){
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DomStrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            
            document.querySelector(DomStrings.incomeLabel).textContent=formatNumber(obj.totalINC,'inc');
            
            document.querySelector(DomStrings.expenseLabel).textContent=formatNumber(obj.totalEXP,'exp');;
           
            document.querySelector(DomStrings.percentageLabel).textContent=obj.percentage;

            if(obj.percentage>0)
            {
                document.querySelector(DomStrings.percentageLabel).textContent=obj.percentage + '%';
            
            }
            else
            {
                document.querySelector(DomStrings.percentageLabel).textContent='----';
            }

        },
        
        displayPercentages : function (percentages)
        {
            var fields = document.querySelectorAll(DomStrings.expensesPercLabel);
   
            nodeListForEach (fields,function(current,index){
                if(percentages[index] > 0 ) 
                {   
                    current.textContent = percentages[index]  + '%' ;
                }
                else
                {
                    current.textContent = '---' ;
                }
            });
        },

        displayMonth: function(){
            var now = new Date(); 
            var month = now.getMonth();
            var months = ['jan','feb','march','april','may','june','july','august','october','november','december'];
            year = now.getFullYear();
            document.querySelector(DomStrings.dataLabel).textContent=months[month] + ' ' + year;     
        
        },

        changedType : function(){
           var fields =  document.querySelectorAll(DomStrings.inputtype + ',' + DomStrings.inputDescription + ','+ DomStrings.inputValue);
            nodeListForEach(fields,function(cur){

                cur.classList.toggle('red-focus');
            });
            document.querySelector(DomStrings.inputBtn).classList.toggle('red');
        },

        getStrings : function()
        {
            return DomStrings;
        }        
    
    };    
        
})();



var Controller = (function(budgetCtrl,UICtrl){
    
 
    var setupEventHandelers = function()
    {
        
            var Dom = UICtrl.getStrings();
                
            document.querySelector(Dom.inputBtn).addEventListener('click',addItem);
            
            document.addEventListener('keypress',function(event)
            {
            if(event.keyCode === 13 || event.which === 13 )
                {
                    ctrladdItem();
                }
        
            });
            document.querySelector(Dom.container).addEventListener('click',ctrlDeleteItem);
            
            document.querySelector(Dom.inputtype).addEventListener('change',UICtrl.changedType);
    };

    var updateBudget= function(){
            budgetController.calculateBudget();
            
            var budget = budgetController.getBudget();
            
            UIController.displayBudget(budget);

    };

    var updatePercentages = function(){

        budgetCtrl.calculatePercentages();
        
        var percentages =  budgetCtrl.getPercentages();
        
        UICtrl.displayPercentages(percentages);
        
    };
    var ctrladdItem=function ()
    {   
        var input = UICtrl.getInput();
        
        if (input.description !== "" && input.value > 0 && !isNaN(input.value))
        { 
            var newItem = budgetCtrl.addItem(input.type,input.description,input.value);
            
            UICtrl.addListItem(newItem,input.type);
            
            UICtrl.clearFields();
            
            updateBudget();
            
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event){
        var splitID,type,ID;
        
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            splitID = itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            budgetCtrl.deleteItem(type,ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };
    
    return {
            init : function()
            {
                console.log('application started bro !!!!!');
                UICtrl.displayMonth();
                UIController.displayBudget({
                
                        budget:0,
                        totalINC :0,
                        totalEXP :0, 
                        percentage :-1   
                });                    
            
                setupEventHandelers();
            }
            
            }


})(budgetController,UIController);

Controller.init();
