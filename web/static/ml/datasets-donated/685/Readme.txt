##################################################

Title: Reinke's edema diagnosis with replicated acoustic features


##################################################

Abstract: Acoustic features extracted from 4 voice recording replications of the sustained /a/ phonation for each one of the 60 subjects (30 suffering from Reinke's edema and 30 healthy).


##################################################

Source:
Carlos J. Perez, University of Extremadura (Spain), carper@unex.es


##################################################

Data Set Information:

Important remarks before using this dataset: 

1. Each row can not be used independently, because every four ones come from one individual. Nature of data is dependent for each subject, but independent from one to another subject. So, traditional technique from machine learning can not be applied to this dataset, because those techniques are based on the independent nature of all the instances. There are 240 instances but for only 60 subjects, so they are not independent. Techniques as those presented in Naranjo et al. (2016), Naranjo et al. (2017), Naranjo et al. (2021) or other specifically designed to address replications can be used. 
2. The concept of replication considered here does not match the classical concept of statistical repeated measurements. The term 'replications' refers to the collection of features extracted from voice recordings belonging to the same subject. Since, in this context, features are extracted from multiple consecutive voice recordings from the same subject, in principle, the features should be identical. The imperfections in technology and the own biological variability result in non-identical replicated features that are more similar to one another than features from different subjects. 
3. All information about how the dataset was generated is presented in Naranjo et al. (2021). 


##################################################

Attribute Information:

1.  ID: Subject’s identifier. 
2.  DISEASE: Healthy, Reinke. 
3.  GENDER: 0=Man; 1=Woman. 
4.  GNE: Glottal-to-noise excitation ratio. 
5.  JITTER: Pitch local perturbation. 
6.  SHIMMER: Amplitude perturbation. 
7.  HNR: Harmonic-to-noise ratio.         
8.  CPP: Cepstral peak prominence. 
9.  MFCC1, MFCC2,…,MFCC13: Mel frequency cepstral coefficient-based spectral measures of order 1 to 13.      
10. HURST: Hurst exponent. 
11. PERMUTATION: Permutation entropy.  
12. PPE: Pitch period entropy. 
13. RPDE: Recurrence period density entropy. 
14. SHANNON: Shannon entropy.    
15. D2: Correlation dimension. 
16. ZCR: Zero-crossing rate. 


##################################################

Relevant Papers:

Lizbeth Naranjo, Carlos J. Perez, Yolanda Campos-Roca, Mario Madruga (2021). 
Replication-based regularization approaches to diagnose Reinke’s edema by using voice recordings, 
Artificial Intelligence in Medicine, 120: 102162, https://doi.org/10.1016/j.artmed.2021.102162

Lizbeth Naranjo, Carlos J. Perez, Jacinto Martín, Yolanda Campos-Roca (2017). A two-stage variable selection 
and classification approach for Parkinson’s disease detection by using voice recording replications, 
Computer Methods and Programs in Biomedicine, 142: 147-156, https://doi.org/10.1016/j.cmpb.2017.02.019

Lizbeth Naranjo, Carlos J. Perez, Yolanda Campos-Roca, Jacinto Martín (2016). Addressing Voice Recording 
Replications for Parkinson’s Disease Detection, Expert systems with Applications, 46, 286-292,  
https://doi.org/10.1016/j.eswa.2015.10.034 


##################################################
Citation Request:

Lizbeth Naranjo, Carlos J. Perez, Yolanda Campos-Roca, Mario Madruga (2021). 
Replication-based regularization approaches to diagnose Reinke’s edema by using voice recordings, 
Artificial Intelligence in Medicine, 120: 102162, https://doi.org/10.1016/j.artmed.2021.102162

##################################################

