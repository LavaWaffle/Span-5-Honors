import axios from 'axios';
import cheerio from 'cheerio';

type spanishDict = {
	presente: string[],
	preterito: string[],
	imperfecto: string[],
	condicional: string[],
	futuro: string[],
	presenteDeSubjuntivo: string[],
	imperfectoDelSubjuntivo: string[],
	futuroDeSubjuntivo: string[],
	afirmativo: string[],
	negativo: string[],
	presenteProgresivo: string[],
	preteritoProgresivo: string[],
	imperfectoProgresivo: string[],
	condicionalProgresivo: string[],
	futuroProgresivo: string[],
	presentePerfecto: string[],
	preteritoPerfecto: string[],
	pluscuamperfecto: string[],
	condicionalPerfecto: string[],
	futuroPerfecto: string[],
	preteritoPerfectoDelSubjuntivo: string[],
	imperfectoPerfectoDelSubjuntivo: string[],
	futuroPerfectoDelSubhuntivo: string[],
	translation: string[],
}

type spanKeys = 
	"presente" |
	"preterito" | 
	"imperfecto" | 
	"condicional" | 
	"futuro" | 
	"presenteDeSubjuntivo" | 
	"imperfectoDelSubjuntivo" | 
	"futuroDeSubjuntivo" | 
	"afirmativo" |
	"negativo" |
	"presenteProgresivo" | 
	"imperfectoProgresivo" |
	"condicionalProgresivo" |
	"futuroPerfecto" | 
	"presentePerfecto" |
	"preteritoProgresivo" |
	"pluscuamperfecto" |
	"condicionalPerfecto" |
	"futuroPerfecto" |
	"preteritoPerfectoDelSubjuntivo" |
	"imperfectoPerfectoDelSubjuntivo" |
	"futuroPerfectoDelSubhuntivo" |
	"futuroProgresivo" |
	"preteritoPerfecto" |
	"translation"
	
const conjTypes: spanKeys[] = [
		"presente",
    "preterito",
    "imperfecto",
    "condicional",
    "futuro",
    "presenteDeSubjuntivo",
    "imperfectoDelSubjuntivo",
    "futuroDeSubjuntivo",
    "afirmativo",
    "negativo",
    "presenteProgresivo",
    "preteritoProgresivo",
    "imperfectoProgresivo",
    "condicionalProgresivo",
    "futuroProgresivo",
    "presentePerfecto",
    "preteritoPerfecto",
    "pluscuamperfecto",
    "condicionalPerfecto",
    "futuroPerfecto",
    "preteritoPerfectoDelSubjuntivo",
    "imperfectoPerfectoDelSubjuntivo",
    "futuroPerfectoDelSubhuntivo"];	
	
// type spanScrape<T = {}> = (verb: string) => Promise<Result<T>>
// type spanScrape = (verb: string) => Promise<success<spanishDict>> | failure

const scrape = async (verb: string) => {
	// console.log('ur mom')
	const start =  Date.now();
	try {
		const { data } = await axios.get(`https://www.spanishdict.com/conjugate/${verb}`);
		// console.log(data)
		// const charlie = "owo";
		const $ = cheerio.load(data);

		// find all html elements who have a parent of div, a grand parent of a, and so on
      const conjItems = $(".ex-tip div a div")
      // all conjugations (and translation) given by spandict
      
		
	const spanConjugations: spanishDict = {
        presente: [],
        preterito: [],
        imperfecto: [],
        condicional: [],
        futuro: [],
        presenteDeSubjuntivo: [],
        imperfectoDelSubjuntivo: [],
        futuroDeSubjuntivo: [],
        afirmativo: [],
        negativo: [],
        presenteProgresivo: [],
        preteritoProgresivo: [],
        imperfectoProgresivo: [],
        condicionalProgresivo: [],
        futuroProgresivo: [],
        presentePerfecto: [],
        preteritoPerfecto: [],
        pluscuamperfecto: [],
        condicionalPerfecto: [],
        futuroPerfecto: [],
        preteritoPerfectoDelSubjuntivo: [],
        imperfectoPerfectoDelSubjuntivo: [],
        futuroPerfectoDelSubhuntivo: [],
        translation: [],
      }
      // get all keys of conjugations and store them in a list
      
      // loop through the conjItems and add them to conjugations
      conjItems.each((index, item) => {
		// console.log(conjTypes[index % 5])
        // first 30 items (presente, preterito, imperfecto, condicional, futura)
        // console.log(index )
        if (index < 30) {
          spanConjugations[conjTypes[index % 5] as keyof spanishDict].push($(item).text())
        } else 
        // next 18 items  (PDS, IDS, FDS)
        if (index < 48) {
          spanConjugations[conjTypes[5 + index % 3] as keyof spanishDict].push($(item).text())
        } else
        // next 10 items (mandato +, mandato -) (yo doesn't exist for thess forms)
        if (index < 58) {
          spanConjugations[conjTypes[8 + index % 2] as keyof spanishDict].push($(item).text())
        } else 
        // next 30 items (presPro, pretPro, impPro, condPro, futPro)
        if (index < 88) {
          spanConjugations[conjTypes[10 + (index+2) % 5] as keyof spanishDict].push($(item).text())
        } else 
        // next 30 items (presPer, pretPer, impPer, condPer, futPer)
        if (index < 118) {
          spanConjugations[conjTypes[15 + (index+2) % 5] as keyof spanishDict].push($(item).text())
        } else 
        // last 18 items (presPerSub, impPerSub, futPerSub)
        if (index < 136) {
          spanConjugations[conjTypes[20 + (index+2) % 3] as keyof spanishDict].push($(item).text())
        }
      })

      // find all definitions
      for (let i = 1; i <= 5; i++) {
        // find HTML element with following details
        const element = $(`#quickdef${i}-es a`) 
        // get text from element
        const def: string = $(element[0]).text()

        // if text length is greater than 0
        if (def) {
          spanConjugations.translation.push(def)
        }
      }

		if (spanConjugations.presente.length <= 0) return {
			success: false,
			reason: "Scrape failed"
		}
		// console.log(spanConjugations);
		return {
			success: true,
			spanConjugations,
			time: Date.now() - start,
		};
      // res.statusCode = 200
      // return res.json({
      //   verb,
      //   conjugations: spanConjugations,
      //   time: new Date() - start,
      // })
		
	} catch (e) {
		console.log('error: ' + e);
		return {
			success: false,
			reason: e
		}
	}
	
}


type wordScrape = {
	presente: string[],
	imperfecto: string[],
	preterito: string[],
	futuro: string[],
	condicional: string[],
	preteritoPerfecto: string[],
	pluscuamperfecto: string[],
	futuroPerfecto: string[],
	condicionalPerfecto: string[],
	presenteDeSubjuntivo: string[],
	imperfectoDelSubjuntivo: string[],
	futuroDeSubjuntivo: string[],
	preteritoPerfectoDelSubjuntivo: string[],
	pluscuamperfectoDeSubjuntivo: string[],
	badFuturoDeSubjuntivo: string[],
	afirmativo: string[],
	negativo: string[],
	preteritoAnterior: string[],
}

type wordKey = "presente" |
	"imperfecto" |
	"preterito" |
	"futuro" |
	"condicional" |
	"preteritoPerfecto" |
	"pluscuamperfecto" |
	"futuroPerfecto" |
	"condicionalPerfecto" |
	"presenteDeSubjuntivo" |
	"imperfectoDelSubjuntivo" |
	"futuroDeSubjuntivo" |
	"preteritoPerfectoDelSubjuntivo" |
	"pluscuamperfectoDeSubjuntivo" |
	"badFuturoDeSubjuntivo" |
	"afirmativo" |
	"negativo" |
	"preteritoAnterior"

const wordKinds: wordKey[] = ["presente",
	"imperfecto",
	"preterito",
	"futuro",
	"condicional",
	"preteritoPerfecto",
	"pluscuamperfecto",
	"futuroPerfecto",
	"condicionalPerfecto",
	"presenteDeSubjuntivo",
	"imperfectoDelSubjuntivo",
	"futuroDeSubjuntivo",
	"preteritoPerfectoDelSubjuntivo",
	"pluscuamperfectoDeSubjuntivo",
	"badFuturoDeSubjuntivo",
	"afirmativo",
	"negativo",
	"preteritoAnterior"]


const dict = async (verb: string) => {
	const page = `https://www.wordreference.com/conj/esverbs.aspx?v=${verb}`;
	const start =  Date.now();
	try {
      // get HTML from page
      const { data } = await axios.get(page);
      // load HTML into cheerio
      const $ = cheerio.load(data);
      // find all html elements who have a parent of div, a grand parent of a, and so on
      const conjItems = $("table.neoConj tr td")
      // all conjugations (and translation) given by spandict
      const wordConjugations: wordScrape = {
        presente: [],
        imperfecto: [],
        preterito: [],
        futuro: [],
        condicional: [],
        preteritoPerfecto: [],
        pluscuamperfecto: [],
        futuroPerfecto: [],
        condicionalPerfecto: [],
        presenteDeSubjuntivo: [],
        imperfectoDelSubjuntivo: [],
        futuroDeSubjuntivo: [],
        preteritoPerfectoDelSubjuntivo: [],
        pluscuamperfectoDeSubjuntivo: [],
        badFuturoDeSubjuntivo: [],
        afirmativo: [],
        negativo: [],
        preteritoAnterior: [],
      }
      
    
      conjItems.each((index, item) => {
        if (wordConjugations[wordKinds[Math.floor(index/7)] as keyof wordScrape].length !== 6) {
          wordConjugations[wordKinds[Math.floor(index/7)] as keyof wordScrape].push($(item).text())
        }
        // console.log(`${conjTypes[Math.floor(index/7)]} : ${$(item).text()}`)
      })

	let exists = false;
	for (const conj in wordConjugations) {
		const array = wordConjugations[conj as keyof wordScrape];
		if (array.length <= 5) {
			exists = true;
		}
	}
	if (exists) return {
		success: false,
		reason: "failed to scrape",
	}
	// if (wordConjugations.presente.length <= 5) return {
	// 	success: false,
	// 	reason: "failed to scrape",
	// }
		
	// console.log(wordConjugations);
    return {
		success: true,
		data: wordConjugations,
		time: Date.now() - start,
	}
    } catch (e) {
    	return {
			success: false,
			reason: e,
		}
    }
}

// dict('pizcar').then((res) => {
// 	console.log(res)
// })

// scrape('hacer').then((res) => {
// 	console.log(res);
// })

type span5Conj = {
	translation: string,
	presente: [string, string, string, string, string, string],// +
	presenteProgresivo: [string, string, string, string, string, string],// +
	imperfecto: [string, string, string, string, string, string],//+
	preteritePerfecto: [string, string, string, string, string, string],//presentePerfecto +
	pluscuamperfecto: [string, string, string, string, string, string],//pluscuamperfecto
	futuroInmediato: [string, string, string, string, string, string],// EEK ir a (verb)
	futuroSimple: [string, string, string, string, string, string],// +
	condicional: [string, string, string, string, string, string],// +
	presenteDeSubjuntivo: [string, string, string, string, string, string],//+
	preteritoPerfectoDelSubjuntivo: [string, string, string, string, string, string],// word ref
	imperfectoDelSubjuntivo: [string, string, string, string, string, string], // word ref
	pluscuamperfectoDelSubjuntivo: [string, string, string, string, string, string],// word ref
	afirmativo: [string, string, string, string, string, string],
	negativo: [string, string, string, string, string, string],
}

type six = [string, string, string, string, string, string];

function createImediateFuture(verb: string): six {
	return [
		`voy a ${verb}`,
		`vas a ${verb}`,
		`va a ${verb}`,
		`vamos a ${verb}`,
		`vais a ${verb}`,
		`van a ${verb}`
	]
}

export async function span5(verb: string): Promise<{success: true, spanDictTime: number, wordRefTime: number, data: span5Conj} | {success: false, reason: string}> {
	const wordRef = await dict(verb);
	const spanDict = await scrape(verb);
	
	if (wordRef.success == false 
		|| spanDict.success == false
		|| typeof spanDict.spanConjugations?.presente == 'undefined'
		|| typeof spanDict.spanConjugations?.presenteProgresivo == 'undefined'
		// || spanDict.spanConjugations.presente.length != 6
	) return {
		success: false,
		reason: "word ref or span dict failed"
	}
	
	return {
		success: true,
		spanDictTime: spanDict.time ?? 0,
		wordRefTime: wordRef.time ?? 0,
		data: {
			presente: spanDict.spanConjugations.presente.splice(0, 6) as six,
			presenteProgresivo: spanDict.spanConjugations.presenteProgresivo.splice(0, 6) as six,
			imperfecto: spanDict.spanConjugations.imperfecto.splice(0, 6) as six,
			preteritePerfecto: spanDict.spanConjugations.presentePerfecto.splice(0, 6) as six,
			pluscuamperfecto: spanDict.spanConjugations.pluscuamperfecto.splice(0, 6) as six,
			futuroInmediato: createImediateFuture(verb),
			futuroSimple: spanDict.spanConjugations.futuro.splice(0, 6) as six,
			condicional: spanDict.spanConjugations.condicional.splice(0, 6) as six,
			presenteDeSubjuntivo: spanDict.spanConjugations.presenteDeSubjuntivo.splice(0, 6) as six,
			preteritoPerfectoDelSubjuntivo: wordRef.data?.preteritoPerfectoDelSubjuntivo.splice(0, 6) as six,
			imperfectoDelSubjuntivo: wordRef.data?.imperfectoDelSubjuntivo.splice(0, 6) as six,
			pluscuamperfectoDelSubjuntivo: wordRef.data?.pluscuamperfectoDeSubjuntivo.splice(0, 6) as six,
			afirmativo: wordRef.data?.afirmativo.splice(0, 6) as six,
			negativo: wordRef.data?.negativo.splice(0, 6) as six,
			translation: spanDict.spanConjugations.translation[0] ?? ""
		}
	}
}