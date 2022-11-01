# PSI Contract Designer
> Functional Specification

## General Description
## Features

## Organization Construction & Process Structure Designer
### Process Structure Designer
- The layout consists of:
  - drawing canvas
  - toolbar (on the left)
  - property panel (on the right)
- Toolbar :
  - has two parts, top one for selecting an editation mode (move, scale select, connect) and the bottom one for selecting an element to draw
  - the elements implement transaction axiome (request, accept, promise, reject)

![Screenshot](docs/Process_Structure_Designer.png)

red: toolbar
green: canvas
yellow: property panel



- After inserting an element the user can click on it to reveal a context menu, which allows himt to change the type of an element, delete the element, append another element, connect it to another element and change the type

![Screenshot](docs/Process_Structure_Designer02.png)

## Object Fact Designer
### Drawing canvas
- Hide button - Button for shut up object must be disabled and hidden.

![Screenshot](docs/Hide_button.png)

- Add fact - User must be able to add fact. Button for this will be in the control bar and after clicking ‘add’ adds ‘fact’ to canvas.
      - ‘Fact’ must have title. Title is centered in fact and is on top. Fact is separated with line under then.
      - ‘Fact’ have description. Description is under title separator, must lie in fact box and is aligned to left.

![Screenshot](docs/fact.png)

- Add ‘external fact’ - Same as adding ‘fact’, only have little bit darker background for easy recognition in editor.

![Screenshot](docs/external_fact.png)

- Add ‘product’ - Create product same as ‘fact’ or ‘external fact’, but with different layout.
    - ‘Product’ must have title. Title will be separated by line and lie on top of object.
    - ‘Product’ must have condition. Condition number is in square with red border. Condition lie under title.
    - ‘Product’ must have fact. ‘Fact’ have same design as description in ‘fact’ and lie under condition. Under ‘fact’ is separate line for graphical separation of ‘fact’ and data.
    - ‘Product’ must have data. Data have same design as description and lie on bottom of product.

![Screenshot](docs/product.png)

- Add ‘edge’ - User must can connect two object with ‘edge’. For add ‘edge’ user most hover mouse of object, click on arrow in surrounding of object, click on arrow and pull to second object.
    - ‘Edge’ is arrow from first object (hovered object) to second.
    - ‘Edge’ can have description over the edge.
- Add ‘edge description’ - For add or change description of ‘edge’ doubleclick on ‘edge’ and write description.
- Reverse or change ‘edge’ - User must have way to change ‘edge’ orientation. For change or reverse ‘edge’ click on button under ‘edge’. First option is first object to second, second option is second object to first and third option is ‘edge’ without orientation.

![Screenshot](docs/edge.png)

### Control bar

![Screenshot](docs/control_bar.png)

- After global buttons in control bar for all editors will be available buttons defined in this part.
- Delete - Delete button for delete actually selected object. Delete object can be too with select object and press delete on keyboard.
- Add ‘fact’ - Button create new ‘fact’ object in canvas. ‘Fact’ is defined in drawing canvas. In title of ‘fact’ will be text “Fact” and in data will be text “DATA”.
- Add ‘external fact’ - Button create new ‘external fact’ object in canvas. External is defined in drawing canvas. ‘External fact’ will be filled same as fact.
- Add ‘product’ - Button create new ‘product’ object in canvas. ‘Product’ is defined in drawing canvas. In title of product will be text “Product”. In condition will be text “P?”, in fact will be text “FACT” and in data will be text “DATA”.
### Data design
- In fact can be used only specified computer types: string int, uint, smart contract address (will be actualized)
- Condition P? in product must exist in blockchain.
- Computer types in data is defined in square brackets after data name.


## Action Model Designer
### Designer Area

![Screenshot](docs/Designer_Area.png)

Designer Area consists of three parts:
- Toolbar with different blocks
- The designer area where the user puts down the blocks
- Delete area marked with an image of a trash bin

The user drags different blocks from the toolbar and then connects them. Blocks have labels, text fields, and a dropdown that projects entities from other diagrams. If he is unsatisfied with any block he can move it to the Delete area and the block is destroyed.

### Rule Block

![Screenshot](docs/Rule_Block.png)

The rule block has different variations. They are created from one basic block and three optional additional rules. They could be added to the basic block by clicking on the gear in the top-left corner of the block.

![Screenshot](docs/Rule.png)

There are many input elements for specification of action rule:
- Name
    - First Input text field serves for naming the action rule.
- When
    - This part identifies a situation when the rule is used.
    - The first Dropdown shows a list of created transactions in OCD and the second one in the state of this transaction is the rule applied.
    - Mandatory part
- While
    - The rule can be also dependent on the child transaction state. This part has the same input elements as When part.
    - Optional addition
- With
    - For triggering there could be also data fields that the user will work in the rule. If there are no data inserted yet, the action rule cannot be applied. For that, he can add the part with where he specifies needed data fields from the OFD.
    - Optional addition
- If
    - Allows connecting If Blocks.
    - Mandatory part
- Then
    - When previous If the part is evaluated as true then the rule applies Action Blocks connected to this part.
    - Mandatory part
- Else
    - When previous If part is evaluated as false then the rule applies Action Blocks connected to this part. If it is not present nothing will happen.
    - Additional part

### With Block

![Screenshot](docs/With_Block.png)

Block with Dropdown element that shows data fields from OFD. There could be multiple With Blocks in With part.

### If Blocks

![Screenshot](docs/If_Block.png)

The first block allows adding bool expression. The second one illustrates comparison where we can compare transaction property (this keyword referring to the transaction in When part or other transaction) and value of its data member.

### Action Blocks

![Screenshot](docs/Action_Blocs.png)

All Action Blocks could be connected multiple times. They are:
    - Assignment of a calculated variable.
    - The other will be specified after consulting.


## Smart Contract Generation
### The Beginning of Generation

![Screenshot](docs/Begginning_of_generation.png)

The process of generating Smart Contracts begins with the user clicking on the Button Generate contract in the top-right corner of the application. Then a small window will pop up for the user to select from which Blockchain programming language should be the DEMO model generated. This window serves also as a last confirmation step before generation.

___Generate contract - Confirmation Window elements___
- Dropdown Menu of available programming languages
    - Cardano - Plutus
    - Ethereum - Solidity
- Smart Contract Path Input text field
- Confirm Button
- Cancel Button

The user should have always an option to cancel or abort the current generation. Confirm Button will close the current window and open a new one showing the progress of generation.

### Data Validation and Completeness Control

After confirmation with selecting a specific programming language, a new window will show up. Here, the user can see progress which can be aborted any time. Meanwhile, the application will check if all needed diagrams, attributes and action rules are available. If not error message “Generation cannot be completed. Components missing:” with the list of needed DEMO model parts and OK Button will pop up. Generation is canceled after that. Status is shown in this part: “Checking presence of needed components....”.

___Generate contract - Generation progress Window elements___
- Loading wheel Image
- Status Text
- Abort Button

### Data Transformation

After all available components are successfully checked, the status will change to “Generating Smart Contract...”. The program will now begin to transform all data from diagrams and models to file using template corresponding with previous user choice of Blockchain language. If the generation was unsuccessful, the error message will pop up with the type of error. Otherwise, the status will change to “Smart Contract was successfully generated” and Cancel Button will change to OK Button.
