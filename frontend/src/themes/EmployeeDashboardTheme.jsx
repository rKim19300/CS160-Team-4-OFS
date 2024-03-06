import { 
    extendTheme
  } from "@chakra-ui/react";

const statisticsPageTheme = extendTheme({  
    components: {
        Stat: {
            baseStyle: {
                label: {},
                  helpText: {},
                  container: {
                    rounded: "lg",
                    borderWidth: "2px",
                    borderColor: "grey", 
                    p: "2"
                  },
                  icon: {},
                  number: {},
            }
        },
        Tabs: {
            baseStyle: {
                tab: {
                    fontWeight: "semibold", 
                    backgroundColor: "green",
                    _selected: { color: "green", }
                }
            }
        },
    }

});

export default statisticsPageTheme;