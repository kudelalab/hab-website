from .Lab import Lab


def make_labs():
    kudela = Lab(
        name = "kudela", 
        data_path = "kudela", 
        hab_list = [
            'Akashiwo', 'Alexandrium_singlet', 'Ceratium', 'Cochlodinium', \
            'Dinophysis', 'Lingulodinium', 'Pennate', 'Prorocentrum', \
            'Pseudo_nitzschia'
        ], 
        hab_thresholds = {
            "Alexandrium_singlet": 0,
            "Dinophysis": 500,
            "Pseudo_nitzschia": 10000,
        }
    )

    humboldt = Lab(
        name = "humboldt", 
        data_path = "humboldt", 
        hab_list = [
            'Akashiwo', 'Alexandrium_singlet', 'Ceratium', 'Cochlodinium', \
            'Dinophysis', 'Lingulodinium', 'Pennate', 'Prorocentrum', \
            'Pseudo-nitzschia'
        ], 
        hab_thresholds = {
            "Alexandrium_singlet": 0,
            "Dinophysis": 500,
            "Pseudo-nitzschia": 10000,
        }
    )

    return({

        "kudela" : kudela,
        "humboldt" : humboldt
        
    })
