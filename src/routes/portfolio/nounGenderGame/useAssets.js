export default function useAssets(asset) {
    console.log("In use assets: ", asset)
    const assets = import.meta.glob('/src/lib/nounImages', {eager: true});

    const getImageUrl = () => {
     if (assets[asset]) {
       return assets[asset].default
     }
    }
  
    return getImageUrl()
  }