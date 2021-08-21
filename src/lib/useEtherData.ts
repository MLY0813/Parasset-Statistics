
import axios from "axios";
import { BigNumber } from "@ethersproject/bignumber";
import { useState } from "react";

type Front18Data_mor = {
    allAddress:Array<string>,
    morNestTotal:BigNumber,
    morNestUserPoint:Array<BigNumber>,
    morETHTotal:BigNumber,
    morETHUserPoint:Array<BigNumber>
}

type Front18Data_ins = {
    allAddress: Array<string>,
    insUSDTTotal: BigNumber,
    insUSDTUserPoint: Array<BigNumber>,
    insETHTotal: BigNumber,
    insETHUserPoint: Array<BigNumber>,
}

const coinCode = '0x22a94595'
const decreaseCode = '0xb1ef1e44'
const supplementCode = '0x08ff8ea6'
const subInsCode = '0x871f2a34'
const redInsCode = '0x4240a264'
const block18 = BigNumber.from('13048516')

export function useFront18Data_mor():Front18Data_mor {
    const [state, setstate] = useState({
        allAddress: [''],
        morNestTotal: BigNumber.from('0'),
        morNestUserPoint: [BigNumber.from('0')],
        morETHTotal: BigNumber.from('0'),
        morETHUserPoint: [BigNumber.from('0')],
    })
    // 1.获取全部抵押交易
    var totalPoint_nest = BigNumber.from('0')
    var pointArray_nest: Array<BigNumber> = []
    var totalPoint_eth = BigNumber.from('0')
    var pointArray_eth: Array<BigNumber> = []
    
    const ethTokenCode = '0000000000000000000000000000000000000000000000000000000000000000'
    const nestTokenCode = '00000000000000000000000004abeda201850ac0124161f037efd70c74ddc74c'
    var api='https://api.etherscan.io/api?module=account&action=txlist&address=0xd8E5EfE8DDbe78C8B08bdd70A6dc668F54a6C01c&startblock=0&endblock=99999999&page=1&offset=3000&sort=asc&apikey=33VWZP4T5GYEYXSF7F65MZPTD1KPSFW8K6';
    axios.get(api)
    .then(function (response) {
        const baseData = response.data['result']
        // 1-1.筛选铸币、增加抵押、减少抵押交易
        var usedData: Array<any> = []
        for (let index = 0; index < baseData.length; index++) {
            const element = baseData[index];
            if (element['input'].indexOf(coinCode) !== -1 ||
                element['input'].indexOf(decreaseCode) !== -1 ||
                element['input'].indexOf(supplementCode) !== -1) {
                usedData.push(element)
            }
        }
        // 1-2.筛选用户地址地址
        var userAdd: Array<string> = []
        for (let index = 0; index < usedData.length; index++) {
            const element = usedData[index];
            if (userAdd.indexOf(element['from']) === -1) {
                userAdd.push(element['from'])
            }
        }
        // 1-3.区分nest和eth
        var nestMorArray: Array<any> = []
        var ethMorArray: Array<any> = []
        for (let index = 0; index < usedData.length; index++) {
            const element = usedData[index];
            if (element['input'].indexOf(nestTokenCode) !== -1) {
                nestMorArray.push(element)
            } else if (element['input'].indexOf(ethTokenCode) !== -1) {
                ethMorArray.push(element)
            }
        }
        // 1-4.积分
        for (let i = 0; i < userAdd.length; i++) {
            var startBlock = BigNumber.from('0')
            var startAmount = BigNumber.from('0')
            var userPoint = BigNumber.from('0')
            const ele = userAdd[i];
            for (let index = 0; index < nestMorArray.length; index++) {
                const element = nestMorArray[index];
                if (element['from'] === ele) {
                    if (startBlock !== BigNumber.from('0')) {
                        userPoint = userPoint.add((BigNumber.from(element['blockNumber']).sub(startBlock)).mul(startAmount))
                    }
                    startBlock = BigNumber.from(element['blockNumber'])
                    startAmount = getMorAmount(startAmount, element)
                }
                if (index === nestMorArray.length - 1) {
                    userPoint = userPoint.add((block18.sub(startBlock)).mul(startAmount))
                }
            }
            totalPoint_nest = totalPoint_nest.add(userPoint)
            pointArray_nest.push(userPoint)
        }
        for (let i = 0; i < userAdd.length; i++) {
            var startBlock = BigNumber.from('0')
            var startAmount = BigNumber.from('0')
            var userPoint = BigNumber.from('0')
            const ele = userAdd[i];
            for (let index = 0; index < ethMorArray.length; index++) {
                const element = ethMorArray[index];
                if (element['from'] === ele) {
                    if (startBlock !== BigNumber.from('0')) {
                        userPoint = userPoint.add((BigNumber.from(element['blockNumber']).sub(startBlock)).mul(startAmount))
                    }
                    startBlock = BigNumber.from(element['blockNumber'])
                    startAmount = getMorAmount(startAmount, element)
                }
                if (index === nestMorArray.length - 1) {
                    userPoint = userPoint.add((block18.sub(startBlock)).mul(startAmount))
                }
            }
            totalPoint_eth = totalPoint_eth.add(userPoint)
            pointArray_eth.push(userPoint)
        }
        setstate({
            allAddress: userAdd,
            morNestTotal: totalPoint_nest,
            morNestUserPoint: pointArray_nest,
            morETHTotal: totalPoint_eth,
            morETHUserPoint: pointArray_eth,
        })
    })
    .catch(function (error) {
        console.log(error);
    });

    return state
}

export function useFront18Data_ins():Front18Data_ins {
    const [state, setstate] = useState({
        allAddress: [''],
        insUSDTTotal: BigNumber.from('0'),
        insUSDTUserPoint: [BigNumber.from('0')],
        insETHTotal: BigNumber.from('0'),
        insETHUserPoint: [BigNumber.from('0')],
    })
    var totalPoint_usdt = BigNumber.from('0')
    var pointArray_usdt: Array<BigNumber> = []
    var totalPoint_eth = BigNumber.from('0')
    var pointArray_eth: Array<BigNumber> = []
    const usdtTokenCode = '000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7'
    var api='https://api.etherscan.io/api?module=account&action=txlist&address=0xc80Ebc9eC1BB8DBC8e93D4C904372dD19786dc9C&startblock=0&endblock=99999999&page=1&offset=3000&sort=asc&apikey=33VWZP4T5GYEYXSF7F65MZPTD1KPSFW8K6';
    axios.get(api)
    .then(function (response) {
        const baseData = response.data['result']
        var usedData = []
        for (let index = 0; index < baseData.length; index++) {
            const element = baseData[index];
            if (element['input'].indexOf(subInsCode) !== -1 || element['input'].indexOf(redInsCode) !== -1) {
                usedData.push(element)
            }
        }
        var userAdd: Array<string> = []
        for (let index = 0; index < usedData.length; index++) {
            const element = usedData[index];
            if (userAdd.indexOf(element['from']) === -1) {
                userAdd.push(element['from'])
            }
        }
        var usdtMorArray: Array<any> = []
        var ethMorArray: Array<any> = []
        for (let index = 0; index < usedData.length; index++) {
            const element = usedData[index];
            if (element['input'].indexOf(usdtTokenCode) !== -1) {
                usdtMorArray.push(element)
            } else {
                ethMorArray.push(element)
            }
        }

        for (let i = 0; i < userAdd.length; i++) {
            var startBlock = BigNumber.from('0')
            var startAmount = BigNumber.from('0')
            var userPoint = BigNumber.from('0')
            const ele = userAdd[i];
            for (let index = 0; index < usdtMorArray.length; index++) {
                const element = usdtMorArray[index];
                if (element['from'] === ele) {
                    if (startBlock !== BigNumber.from('0')) {
                        userPoint = userPoint.add((BigNumber.from(element['blockNumber']).sub(startBlock)).mul(startAmount))
                    }
                    startBlock = BigNumber.from(element['blockNumber'])
                    startAmount = getInsAmount(startAmount, element)
                }
                if (index === usdtMorArray.length - 1) {
                    userPoint = userPoint.add((block18.sub(startBlock)).mul(startAmount))
                }
            }
            totalPoint_usdt = totalPoint_usdt.add(userPoint)
            pointArray_usdt.push(userPoint)
        }

        for (let i = 0; i < userAdd.length; i++) {
            var startBlock = BigNumber.from('0')
            var startAmount = BigNumber.from('0')
            var userPoint = BigNumber.from('0')
            const ele = userAdd[i];
            for (let index = 0; index < ethMorArray.length; index++) {
                const element = ethMorArray[index];
                if (element['from'] === ele) {
                    if (startBlock !== BigNumber.from('0')) {
                        userPoint = userPoint.add((BigNumber.from(element['blockNumber']).sub(startBlock)).mul(startAmount))
                    }
                    startBlock = BigNumber.from(element['blockNumber'])
                    startAmount = getInsAmount(startAmount, element)
                }
                if (index === ethMorArray.length - 1) {
                    userPoint = userPoint.add((block18.sub(startBlock)).mul(startAmount))
                }
            }
            totalPoint_eth = totalPoint_eth.add(userPoint)
            pointArray_eth.push(userPoint)
        }
        setstate({
            allAddress: userAdd,
            insUSDTTotal: totalPoint_usdt,
            insUSDTUserPoint: pointArray_usdt,
            insETHTotal: totalPoint_eth,
            insETHUserPoint: pointArray_eth,
        })
    }).catch(function (error) {
        console.log(error);
    });
    return state
}

function getMorAmount(frontNum:BigNumber, ele:any): BigNumber {
    const inputCode = ele['input']
    if (inputCode.indexOf(coinCode) !== -1) {
        const numStr = inputCode.substr(138,64)
        return frontNum.add(BigNumber.from('0x' + numStr))
    } else if (inputCode.indexOf(decreaseCode) !== -1) {
        const numStr = inputCode.substr(138,64)
        return frontNum.sub(BigNumber.from('0x' + numStr))
    } else if (inputCode.indexOf(supplementCode) !== -1) {
        const numStr = inputCode.substr(138,64)
        return frontNum.add(BigNumber.from('0x' + numStr))
    } else {
        return BigNumber.from('0')
    }
}

function getInsAmount(frontNum: BigNumber, ele:any): BigNumber {
    const inputCode = ele['input']
    if (inputCode.indexOf(subInsCode) !== -1) {
        const numStr = inputCode.substr(74,64)
        return frontNum.add(BigNumber.from('0x' + numStr))
    } else {
        const numStr = inputCode.substr(74,64)
        return frontNum.sub(BigNumber.from('0x' + numStr))
    }
}