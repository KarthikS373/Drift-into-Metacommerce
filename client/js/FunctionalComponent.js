let id = 0
const insideTheDom = {
    components: [],
    check: function () {
        insideTheDom.components.forEach(component => {
            if (!document.contains(component.node) && !component[HOOK_BEHAVIOUR]) {
                console.log('exit', component.node);
                if (component.exit) component.exit()
                insideTheDom.components.filter(a => a != component)
            }
        })
    },
    add: function (component, clean) {
        let index = this.components.indexOf(component)
        if (index > -1) return
        this.components.push(component)
    }

}
const primitevesAllowed = 'number string undefined'.split(' ')
const validatePrimitive = (variable) => {
    if (!primitevesAllowed.includes(typeof variable)) {
        throw `Argument is not an string, number or undefined : '${variable}' in primitiveDispatcher() method.`
    }
}
const validateArray = (database) => {
    if (!Array.isArray(database)) {
        throw `Argument is not an array: '${database}' in arrayDispacher() method.`
    }
}
const FIRST_TIME = Symbol('firstTime')
const STATE_INDEX = Symbol('stateIndex')
const EFFECT_INDEX = Symbol('effectIndex')
const DEFAUT_STATE_DONE = Symbol('defaultStateDone')
const SET_PTOPERTIES = Symbol('setProperties')
const ADD_CHILD = Symbol('addChild')
const CHILDREN = Symbol('children')
const SUB_COMPONENTS = Symbol('subComponent')
const LISTENERS = Symbol('listeners')
const SETING_LISTENER = Symbol('settingListener')
const EXEC = Symbol('exec')
const REFRESH = Symbol('refresh')
const RERENDER = Symbol('re-render')
const USE_EFFECT_CALLBACKS = Symbol('useEffectCallbacks')
const USE_EFFECT_CALLBACKS_PREV = Symbol('useEffectCallbacksPrev')
const RUN_SIDE_EFFECTS = Symbol('runSideEffects')
const HOOK_BEHAVIOUR = Symbol('hookBehaviour')
let publicMethods = {
    runAsHook: function () {
        this[HOOK_BEHAVIOUR] = true
        this[STATE_INDEX] = 0
        this[EFFECT_INDEX] = 0
    },
    useEffect: function (callback, dependencies = []) {
        if (!this[HOOK_BEHAVIOUR]) {
            let hash = JSON.stringify(dependencies)
            let index = this[USE_EFFECT_CALLBACKS].length
            this[USE_EFFECT_CALLBACKS].push(index)
            this[USE_EFFECT_CALLBACKS_PREV][index] = (this[USE_EFFECT_CALLBACKS_PREV][index]) ? this[USE_EFFECT_CALLBACKS_PREV][index] : {
                index,
                storedHash: undefined,
                currentHash: hash,
                sideEffet: callback,
                cleaner: undefined
            }
            this[USE_EFFECT_CALLBACKS_PREV][index].sideEffet = callback
            this[USE_EFFECT_CALLBACKS_PREV][index].currentHash = hash
        }
        if (this[HOOK_BEHAVIOUR]) {
            let index = this[EFFECT_INDEX]++
            let hash = JSON.stringify(dependencies)
            this[USE_EFFECT_CALLBACKS].push(index)
            this[USE_EFFECT_CALLBACKS_PREV][index] = (this[USE_EFFECT_CALLBACKS_PREV][index]) ? this[USE_EFFECT_CALLBACKS_PREV][index] : {
                index,
                storedHash: undefined,
                currentHash: hash,
                sideEffet: callback,
                cleaner: undefined
            }
            let obj = this[USE_EFFECT_CALLBACKS_PREV][index]
            if (obj.storedHash !=hash) {
                if (typeof obj.cleaner === 'function') {
                    obj.cleaner()
                } 
                obj.cleaner = obj.sideEffet(parent)
                obj.storedHash = hash
                if (typeof clean == 'function') {
                    this.exit = ()=>{
                        this[USE_EFFECT_CALLBACKS_PREV].forEach(sideEffet=>{ 
                            sideEffet.cleaner()
                        })
                    }
                    insideTheDom.add(this, clean)
                }
            }
        }
    },
    beforeAppendChild: function (parentNode) { },
    prop: {},
    noProp: ["beforeAppendChild", "prop", "enableSubComponents", "enableEvents", "kiwiSelector", "useState", "noProp"],
    enableSubComponents: function (params) {
        if (Array.isArray(params)) {
            let message = "this.enableSubComponents() only allow Objects but not allows arrays."
            throw message + '\n' + this.constructor
        }
        this[SUB_COMPONENTS] = params
    },
    enableEvents: function (params) {
        this[LISTENERS] = (Array.isArray(params)) ? params : [params]
    },
    kiwiSelector: function (selector) {
        let root = this[EXEC]()
        document.querySelector(selector).appendChild(root)
    },
    useState: function (val) {
        let value = val
        if (!this.state) this.state = {}
        let n = this[STATE_INDEX]++
        if (!this[DEFAUT_STATE_DONE])
            this.state[n] = value
        else {
            value = this.state[n]
        }
        return [
            (typeof value == 'undefined') ? value : JSON.parse(JSON.stringify(this.state[n])),
            (newState) => {
                
                if (typeof this.state[n] == 'object') {
                    Object.assign(this.state[n], (typeof newState == 'function') ? newState() : newState)
                }
                this.state[n] = newState
                if (this[HOOK_BEHAVIOUR]) {
                    this[STATE_INDEX] = 0
                    this[DEFAUT_STATE_DONE] = true
                }
                this[RERENDER]()
                insideTheDom.check()
            }
        ]

    },
    reRender:function(){
        this[RERENDER]()
    },
    useReducer: function (reducer, initialState = {}) {
        if (!this[DEFAUT_STATE_DONE])
            this.state = initialState


        return [this.state, (argument) => {
            this.state = reducer(this.state, argument)
            this[RERENDER]()
        }]
    },
    arrayDispatcher: function (database = []) {
        validateArray(database)
        const callbacks = []
        const list = {
            get items() { return [...database] },
            subscribe: function (callback) {
                callbacks.push(callback)
            }
        }
        let updateList = (newDatabase) => {
            validateArray(database)
            database.length = 0;
            newDatabase.forEach(element => {
                database.push(element);
            })
            callbacks.forEach(callback => callback([...database]))
        }
        return [list, updateList, [...database]]
    },
    variableDispatcher: function (variable) {
        validatePrimitive(variable)
        const callbacks = []
        let valueStored = variable
        const store = {
            get value() { return valueStored },
            subscribe: function (callback) {
                callbacks.push(callback)
            },
        }
        let updateStore = (newValue) => {
            validatePrimitive(newValue)
            valueStored = newValue
            callbacks.forEach(callback => callback(newValue))
        }
        return [store, updateStore, valueStored]
    },
}
let privateMethods = function () {
    this[HOOK_BEHAVIOUR] = false
    this[RUN_SIDE_EFFECTS] = function (parent) {
        if (!this[USE_EFFECT_CALLBACKS]) return
        this[USE_EFFECT_CALLBACKS].forEach((sideEffet, index) => {
            let obj = this[USE_EFFECT_CALLBACKS_PREV][index]
            if (obj.storedHash != obj.currentHash) {
                if (typeof obj.cleaner === 'function') {
                    console.log('cleaner ruuning');
                    obj.cleaner()
                }
                let clean = obj.sideEffet(parent)
                obj.cleaner = clean
                obj.storedHash = obj.currentHash
                // console.log(obj);
                if (typeof clean == 'function') {
                    // insideTheDom.add(this, clean)
                }
            }

        })
        this[USE_EFFECT_CALLBACKS] = []
    }
    this[USE_EFFECT_CALLBACKS] = []
    this[USE_EFFECT_CALLBACKS_PREV] = []
    this[FIRST_TIME] = true
    this[STATE_INDEX] = 0
    this[EFFECT_INDEX] = 0
    this[DEFAUT_STATE_DONE] = false
    this[SET_PTOPERTIES] = function (attr) {
        const prop = {}
        for (let index = 0; index < attr.length; index++) {
            if (typeof this[attr[index].value] == 'function') {
                prop[attr[index].name] =
                    (this.noProp.includes(attr[index].value))
                        ? attr[index].value
                        : this[attr[index].value]();
                if (this.noProp.includes(attr[index].value))
                    console.warn(`Atttribute Value '${attr[index].value}' as string due it is a reserved keyword`);
            } else {
                try {
                    prop[attr[index].name] = JSON.parse(attr[index].value)
                } catch (error) {
                    prop[attr[index].name] = attr[index].value
                }
            }
        }
        return prop
    }
    this[ADD_CHILD] = function (parent) {
        Object.keys(this[SUB_COMPONENTS]).map(name => {
            let subComponent = this[SUB_COMPONENTS][name]
            let nodeList = parent.querySelectorAll(name.toLowerCase())
            this[CHILDREN] = this[CHILDREN] || []
            this[CHILDREN].forEach(c => { c.free = true })
            for (let index = 0; index < nodeList.length; index++) {
                const node = nodeList[index];
                let prop = this[SET_PTOPERTIES](node.attributes)
                let instanceCached = null
                let j = 0
                let fromCache = false
                for (j = 0; j < this[CHILDREN].length; j++) {
                    const c = this[CHILDREN][j];
                    if (c.instanceComponet.constructor.name != name) continue;
                    if (!c.free) continue;
                    instanceCached = c.instanceComponet
                    fromCache = true
                    this[CHILDREN][j] = {
                        free: false,
                        instanceComponet: c.instanceComponet
                    }
                    break;
                }
                let instanceComponet = (fromCache) ? instanceCached : getComponent(subComponent)
                if (!fromCache) {
                    this[CHILDREN][index] = {
                        free: false,
                        instanceComponet
                    }
                }
                instanceComponet.prop = {}
                Object.assign(instanceComponet.prop, prop)
                let newNode = instanceComponet[EXEC]()
                node.parentNode.replaceChild(newNode, node)
            }
        })
        return parent
    }
    this[SUB_COMPONENTS] = []
    this[LISTENERS] = []
    this[SETING_LISTENER] = function (parent, remove = null) {
        this[LISTENERS].map(selector => {
            let nodeList = parent.querySelectorAll('[' + selector + ']')
            for (let index = 0; index < nodeList.length; index++) {
                const node = nodeList[index];
                let method = node.getAttribute(selector)
                if (!method) throw "There is no attribute '" + selector + "' value on:\n\n" + node.outerHTML
                if (remove) {
                    node.removeEventListener(selector, this[method])
                } else {
                    node.addEventListener(selector, this[method])
                }

            }
        });
    }
    this[REFRESH] = function (old, newNode) {
        let refresh = true
        function process(n1, n2) {// Update textContent
            let textContentChaneges = false
            if (n1.lenght == n2.lenght) {
                n1.forEach((text, index) => {
                    if (text.textContent != n2[index].textContent) {
                        if (text.nodeName != n2[index].nodeName) return
                        if (text.childNodes[0] && n2[index].childNodes[0])
                            text.childNodes[0].textContent = n2[index].childNodes[0].textContent
                        else text.textContent = n2[index].textContent
                        refresh = false
                        textContentChaneges = true
                    }
                })
            }
            if (!textContentChaneges) refresh = false
        }
        let oldNodes = old.querySelectorAll('*')
        let newNodes = newNode.querySelectorAll('*')
        if (oldNodes.length != newNode.querySelectorAll('*').length) {
            return true
        }
        oldNodes.forEach((node, index) => {
            if (node.tagName != newNodes[index].tagName) {
                node.parentNode.replaceChild(newNodes[index].cloneNode(true), node)
            }
        })
        try {
            oldNodes.forEach((node, index) => {
                let generated = newNodes[index]
                //Attributes start
                let tmp = {}
                for (const attr of node.attributes) {
                    tmp[attr.name] = attr.value
                }
                for (const attr of generated.attributes) {
                    tmp[attr.name] = attr.value
                }
                let attrChaneges = false
                Object.keys(tmp).forEach((key) => {
                    if (generated.getAttribute(key) == null) {
                        node.removeAttribute(key)
                        attrChaneges = true
                    } else {
                        if (node.getAttribute(key) != generated.getAttribute(key)) {
                            node.setAttribute(key, generated.getAttribute(key))
                            attrChaneges = true
                        }
                    }
                })
                if (attrChaneges) return false
                //Attributes ENDS
                let q1 = node.childNodes
                let q2 = generated.childNodes
                process(q1, q2);
            });
        } catch (error) {
            console.error("SOMETHING WRONG: ", error);
        }
        return refresh
    }
    this[RERENDER] = function () {
        try {
            let old = this.node
            let parent = this.node.parentNode
            this[SETING_LISTENER](this.node.parentNode, true)
            let newObject = this[EXEC](true)
            let refresh = this[REFRESH](old, newObject)
            if (refresh) {
                old.parentNode.replaceChild(newObject, old)//?
            } else {
                this.node = old
                this[SETING_LISTENER](parent)
            }
            this[RUN_SIDE_EFFECTS](parent)
        } catch (error) {
            console.error(error);
        }
    }
    this[EXEC] = function (again) {
        //@TODO AVOID TAG NO CLOSED
        var node = document.createElement('section');
        this[STATE_INDEX] = 0
        Array.prototype.toString = function () {
            return this.join('')
        }
        let string = this.constructor(this.prop)
        if (this[HOOK_BEHAVIOUR]) {
            return string
        }
        let tags = string.split('/>') //self closing tags
        if (tags.length > 1) {
            let last = tags.pop()
            let final = tags.map(a => {
                let tmp = a.split("<")
                let last = tmp[tmp.length - 1]
                let tagName = last.split(' ')[0]
                return a + `></${tagName}>`
            })
            final.push(last)
            string = final.join('')
        }
        Array.prototype.toString = function () {
            return this.join(',')
        }
        this[DEFAUT_STATE_DONE] = true
        node.innerHTML = string
        this[SETING_LISTENER](node)
        this[ADD_CHILD](node)
        let tmp = this[FIRST_TIME]
        if (this[FIRST_TIME]) {
            this[FIRST_TIME] = false
            this.beforeAppendChild(node)
        }
        if (tmp) {
            this[RUN_SIDE_EFFECTS](node)
        }
        this.node = node.children[0]
        if (!this.node) throw `Check the return of ${this.constructor.name}` + '\n' + `${this.constructor.toString()}`
        return this.node
    }
    return this
}
const component = privateMethods.bind(publicMethods)()
function KiwiComponent() { }
let getComponent = (Component) => {
    let instanceComponet = new KiwiComponent();
    let setters = key => {
        instanceComponet[key] = typeof component[key] == 'object' ? Array.isArray(component[key]) ? [] : {} : typeof component[key] == 'function' ? component[key].bind(instanceComponet) : component[key]
    }
    Object.keys(component).map(setters)
    Object.getOwnPropertySymbols(component).forEach(setters);
    instanceComponet.constructor = Component
    if (instanceComponet[FIRST_TIME]) {
        instanceComponet.id = id++
    }
    return instanceComponet
};
export default getComponent