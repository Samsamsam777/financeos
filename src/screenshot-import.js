export function recognizeBankingScreenshot(){return false;}
export async function buildScreenshotTransactions(){
  return {supported:false,transactions:[],message:"Screenshot-Import ist vorübergehend deaktiviert und wird als separates OCR-Modul neu integriert."};
}
