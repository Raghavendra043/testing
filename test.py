
df = pd.read_excel("reading file")
df1 = pd.read_excel("writing file")

col = list(df.columns)
Emptydata = {}

if(df1.shape[0] > df.shape[0]):
    num = df1.shape[0]
    for j in col:
        Emptydata[j] = ["" for i in range(num)]

df2 = pd.DataFrame(Emptydata)

df_final = pd.concat([df, df2], ignore_index = True, axis = 0)